import { Injectable } from '@nestjs/common';
import { GetFactusTokenUseCase } from './get-factus-token.use-case';
import { FactusBillingRepository } from '@domain/repositories/factus/factus-billing.repository';

@Injectable()
export class ValidateFactusBillUseCase {
  constructor(
    private readonly getFactusTokenUseCase: GetFactusTokenUseCase,
    private readonly billingRepository: FactusBillingRepository,
  ) {}

  async execute<T = any>(payload: unknown): Promise<T> {
    const token = await this.getFactusTokenUseCase.execute();
    return await this.billingRepository.validateBill<T>(payload, token.accessToken);
  }
}
