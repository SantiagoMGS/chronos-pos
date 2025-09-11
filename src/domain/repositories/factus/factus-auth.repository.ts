import { FactusToken } from '@domain/entities/factus/factus-token.entity';

export abstract class FactusAuthRepository {
  abstract getToken(): Promise<FactusToken>;
}
