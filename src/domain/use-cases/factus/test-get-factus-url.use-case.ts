import { Injectable, BadRequestException } from '@nestjs/common';
import { GetFactusTokenUseCase } from './get-factus-token.use-case';
import { FactusHttpRepository } from '@domain/repositories/factus/factus-http.repository';
import { envs } from '@core/config/envs';

@Injectable()
export class TestGetFactusUrlUseCase {
  constructor(
    private readonly getFactusTokenUseCase: GetFactusTokenUseCase,
    private readonly factusHttpRepository: FactusHttpRepository,
  ) {}

  async execute<T = any>(fullUrl: string): Promise<T> {
    if (!this.isValidFactusUrl(fullUrl)) {
      throw new BadRequestException('URL no permitida. Debe pertenecer a dominios de Factus.');
    }
    const token = await this.getFactusTokenUseCase.execute();
    return await this.factusHttpRepository.get<T>(fullUrl, token.accessToken);
  }

  private isValidFactusUrl(url: string): boolean {
    try {
      const u = new URL(url);
      const allowedHosts = ['api.factus.com.co', 'api-sandbox.factus.com.co'];
      return allowedHosts.includes(u.hostname);
    } catch {
      return false;
    }
  }
}
