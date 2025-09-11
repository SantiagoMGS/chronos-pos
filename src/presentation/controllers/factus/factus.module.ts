import { Module } from '@nestjs/common';
import { GetFactusTokenUseCase } from '@domain/use-cases/factus/get-factus-token.use-case';
import { FactusAuthRepository } from '@domain/repositories/factus/factus-auth.repository';
import { FactusAuthDataSourceService } from '@infrastructure/datasource/factus/factus-auth.datasource.service';
import { FactusController } from './factus.controller';

@Module({
  controllers: [FactusController],
  providers: [
    GetFactusTokenUseCase,
    {
      provide: FactusAuthRepository,
      useClass: FactusAuthDataSourceService,
    },
  ],
  exports: [GetFactusTokenUseCase],
})
export class FactusModule {}
