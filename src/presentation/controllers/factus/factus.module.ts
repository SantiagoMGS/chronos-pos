import { Module } from '@nestjs/common';
import { GetFactusTokenUseCase } from '@domain/use-cases/factus/get-factus-token.use-case';
import { FactusAuthRepository } from '@domain/repositories/factus/factus-auth.repository';
import { FactusAuthDataSourceService } from '@infrastructure/datasource/factus/factus-auth.datasource.service';
import { FactusController } from './factus.controller';
import { TestGetFactusUrlUseCase } from '@domain/use-cases/factus/test-get-factus-url.use-case';
import { FactusHttpRepository } from '@domain/repositories/factus/factus-http.repository';
import { FactusHttpDataSourceService } from '@infrastructure/datasource/factus/factus-http.datasource.service';
import { ValidateFactusBillUseCase } from '@domain/use-cases/factus/validate-factus-bill.use-case';
import { FactusBillingRepository } from '@domain/repositories/factus/factus-billing.repository';
import { FactusBillingDataSourceService } from '@infrastructure/datasource/factus/factus-billing.datasource.service';

@Module({
  controllers: [FactusController],
  providers: [
    GetFactusTokenUseCase,
    TestGetFactusUrlUseCase,
    ValidateFactusBillUseCase,
    {
      provide: FactusAuthRepository,
      useClass: FactusAuthDataSourceService,
    },
    {
      provide: FactusHttpRepository,
      useClass: FactusHttpDataSourceService,
    },
    {
      provide: FactusBillingRepository,
      useClass: FactusBillingDataSourceService,
    },
  ],
  exports: [GetFactusTokenUseCase],
})
export class FactusModule {}
