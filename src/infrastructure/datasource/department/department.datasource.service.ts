import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';
import { DepartmentRepository } from '@domain/repositories/department/department.repository';
import { Department } from '@domain/entities/department.entity';

@Injectable()
export class DepartmentDataSourceService implements DepartmentRepository {
  constructor(private readonly tenantPrisma: TenantPrismaService) {}

  async findAll(): Promise<Department[]> {
    const departments = await this.tenantPrisma.client.department.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return departments;
  }
}
