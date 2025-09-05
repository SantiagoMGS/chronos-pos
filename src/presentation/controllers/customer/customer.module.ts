import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';
import { CustomerRepository } from '@domain/repositories/customer/customer.repository';
import { CustomerDataSourceService } from '@infrastructure/datasource/customer/customer.datasource.service';
import { CreateCustomerUseCase } from '@domain/use-cases/customer/create-customer.use-case';
import { GetCustomerUseCase } from '@domain/use-cases/customer/get-customer.use-case';
import { GetAllCustomersUseCase } from '@domain/use-cases/customer/get-all-customers.use-case';
import { UpdateCustomerUseCase } from '@domain/use-cases/customer/update-customer.use-case';
import { DeleteCustomerUseCase } from '@domain/use-cases/customer/delete-customer.use-case';

@Module({
  controllers: [CustomerController],
  providers: [
    TenantPrismaService,
    CreateCustomerUseCase,
    GetCustomerUseCase,
    GetAllCustomersUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    {
      provide: CustomerRepository,
      useClass: CustomerDataSourceService,
    },
  ],
})
export class CustomerModule {}
