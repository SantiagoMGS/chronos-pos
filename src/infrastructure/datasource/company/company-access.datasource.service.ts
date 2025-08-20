import { Injectable } from '@nestjs/common';
import { PrincipalPrismaService } from '@core/services/principal-prisma-client.service';
import { ActiveUserCompany, CompanyAccessRepository } from '@domain/repositories/company/company-access.repository';

@Injectable()
export class CompanyAccessDataSourceService implements CompanyAccessRepository {
  constructor(private readonly prismaPrincipal: PrincipalPrismaService) {}

  async findActiveUserCompany(userId: string, companyId: string): Promise<ActiveUserCompany | null> {
    const userCompany = await this.prismaPrincipal.client.userCompany.findFirst({
      where: {
        userId,
        companyId,
        isActive: true,
      },
      include: {
        company: true,
      },
    });

    if (!userCompany) return null;

    return { companyDbName: userCompany.company.dbName };
  }
}
