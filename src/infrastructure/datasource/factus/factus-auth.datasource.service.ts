import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { FactusAuthRepository } from '@domain/repositories/factus/factus-auth.repository';
import { FactusToken } from '@domain/entities/factus/factus-token.entity';
import { envs } from '@core/config/envs';
import axios from 'axios';

@Injectable()
export class FactusAuthDataSourceService implements FactusAuthRepository {
  private readonly logger = new Logger(FactusAuthDataSourceService.name);
  private cachedToken: FactusToken | null = null;
  private cachedTokenExpiresAtMs: number | null = null;
  private ongoingRequest: Promise<FactusToken> | null = null;

  private get baseUrl(): string {
    return envs.factusBaseUrl;
  }

  async getToken(): Promise<FactusToken> {
    if (this.cachedToken && this.cachedTokenExpiresAtMs && Date.now() < this.cachedTokenExpiresAtMs) {
      return this.cachedToken;
    }

    if (this.ongoingRequest) {
      return this.ongoingRequest;
    }

    this.ongoingRequest = (async () => {
      if (this.cachedToken?.refreshToken) {
        try {
          return await this.requestRefreshToken();
        } catch (error) {
          this.logger.warn('Fallo al refrescar token de Factus. Intentando password grant...');
        }
      }
      return this.requestNewToken();
    })();
    try {
      const token = await this.ongoingRequest;
      return token;
    } finally {
      this.ongoingRequest = null;
    }
  }

  private async requestNewToken(): Promise<FactusToken> {
    try {
      const url = `${this.baseUrl}/oauth/token`;
      const body = new URLSearchParams({
        grant_type: 'password',
        client_id: envs.factusClientId,
        client_secret: envs.factusClientSecret,
        username: envs.factusUsername,
        password: envs.factusPassword,
      });

      const { data } = await axios.post<{
        token_type: string;
        expires_in: number;
        access_token: string;
        refresh_token: string;
      }>(url, body.toString(), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 15000,
      });

      const mapped: FactusToken = {
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };

      const safetySkewSeconds = 30;
      const effectiveTtlSeconds = Math.max(0, (data.expires_in ?? 0) - safetySkewSeconds);
      this.cachedToken = mapped;
      this.cachedTokenExpiresAtMs = Date.now() + effectiveTtlSeconds * 1000;

      return mapped;
    } catch (error) {
      this.logger.error('Error autenticando con Factus (password grant)');
      throw new InternalServerErrorException('No se pudo obtener el token de Factus');
    }
  }

  private async requestRefreshToken(): Promise<FactusToken> {
    if (!this.cachedToken?.refreshToken) {
      throw new InternalServerErrorException('No hay refresh token disponible para Factus');
    }

    try {
      const url = `${this.baseUrl}/oauth/token`;
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: envs.factusClientId,
        client_secret: envs.factusClientSecret,
        refresh_token: this.cachedToken.refreshToken,
      });

      const { data } = await axios.post<{
        token_type: string;
        expires_in: number;
        access_token: string;
        refresh_token: string;
      }>(url, body.toString(), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 15000,
      });

      const mapped: FactusToken = {
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };

      const safetySkewSeconds = 30;
      const effectiveTtlSeconds = Math.max(0, (data.expires_in ?? 0) - safetySkewSeconds);
      this.cachedToken = mapped;
      this.cachedTokenExpiresAtMs = Date.now() + effectiveTtlSeconds * 1000;

      return mapped;
    } catch (error) {
      this.logger.error('Error refrescando token de Factus');
      throw new InternalServerErrorException('No se pudo refrescar el token de Factus');
    }
  }
}
