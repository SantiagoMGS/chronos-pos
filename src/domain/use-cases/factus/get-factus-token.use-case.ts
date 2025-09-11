import { Injectable } from '@nestjs/common';
import { FactusAuthRepository } from '@domain/repositories/factus/factus-auth.repository';
import { FactusToken } from '@domain/entities/factus/factus-token.entity';

@Injectable()
export class GetFactusTokenUseCase {
  constructor(private readonly factusAuthRepository: FactusAuthRepository) {}

  async execute(): Promise<FactusToken> {
    return this.factusAuthRepository.getToken();
  }
}
