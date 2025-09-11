import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';
import { MeasurementUnitRepository } from '@domain/repositories/measurement-unit/measurement-unit.repository';
import { MeasurementUnit } from '@domain/entities/measurement-unit.entity';

@Injectable()
export class MeasurementUnitDataSourceService implements MeasurementUnitRepository {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async findAll(): Promise<MeasurementUnit[]> {
    const rows = await this.tenantPrisma.client.measurementUnit.findMany({ orderBy: { name: 'asc' } });
    return rows;
  }
}
