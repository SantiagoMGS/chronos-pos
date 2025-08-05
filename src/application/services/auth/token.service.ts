import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envs } from '@core/config/envs';
import { TokenPayload } from './interfaces/token-payload.entity';
import { TokenResponse } from './interfaces/token-response.entity';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateTokens(payload: TokenPayload): TokenResponse {
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: envs.jwtRefreshSecret,
      expiresIn: envs.jwtRefreshExpiration,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
