import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';
import { DepartmentRepository } from '@domain/repositories/department/department.repository';
import { CityRepository } from '@domain/repositories/city/city.repository';
import { DepartmentDataSourceService } from '@infrastructure/datasource/department/department.datasource.service';
import { CityDataSourceService } from '@infrastructure/datasource/city/city.datasource.service';
import { GetAllDepartmentsUseCase } from '@domain/use-cases/common/get-all-departments.use-case';
import { GetCitiesUseCase } from '@domain/use-cases/common/get-cities.use-case';

@Module({
  controllers: [CommonController],
  providers: [
    TenantPrismaService,
    GetAllDepartmentsUseCase,
    GetCitiesUseCase,
    { provide: DepartmentRepository, useClass: DepartmentDataSourceService },
    { provide: CityRepository, useClass: CityDataSourceService },
  ],
})
export class CommonModule {}
