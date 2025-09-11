import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';
import { CityRepository } from '@domain/repositories/city/city.repository';
import { City } from '@domain/entities/city.entity';

@Injectable()
export class CityDataSourceService implements CityRepository {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async findAll(): Promise<City[]> {
    const rows = await this.tenantPrisma.client.city.findMany({ orderBy: { name: 'asc' } });
    return rows;
  }

  async findByDepartment(departmentId: string): Promise<City[]> {
    const rows = await this.tenantPrisma.client.city.findMany({ where: { departmentId }, orderBy: { name: 'asc' } });
    return rows;
  }
}
