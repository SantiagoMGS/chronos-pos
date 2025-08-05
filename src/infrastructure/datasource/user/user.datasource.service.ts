import { Injectable } from '@nestjs/common';
import { PrincipalPrismaService } from '@core/services/principal-prisma-client.service';
import { UserRepository } from '@domain/repositories/user/user.repository';

@Injectable()
export class UserDataSourceService implements UserRepository {
  constructor(private readonly prismaPrincipal: PrincipalPrismaService) {}

  async getUserByEmail(email: string): Promise<any> {
    const user = await this.prismaPrincipal.client.user.findFirst({
      where: { email },
      include: {
        userCompanies: {
          where: { isActive: true },
          include: {
            company: {
              include: {
                companyBranding: true,
              },
            },
          },
        },
        userCredentials: {
          where: { isActive: true },
        },
      },
    });

    return user || null;
  }

  async getUserById(id: string): Promise<any> {
    return;
  }
}
