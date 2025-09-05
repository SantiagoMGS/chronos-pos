import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { TokenPayload } from '@application/services/auth/interfaces/token-payload.entity';
import { TokenService } from '@application/services/auth/token.service';
import { UserFinderService } from '@application/services/user/user-finder.service';
import { CompanyAccessRepository } from '@domain/repositories/company/company-access.repository';
import { PermissionsRepository } from '@domain/repositories/auth/permissions.repository';
import { CompanyInfoDto } from '@presentation/controllers/auth/dtos/permissions-response.dto';

@Injectable()
export class SetCompanyUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly companyAccessRepository: CompanyAccessRepository,
    private readonly permissionsRepository: PermissionsRepository,
  ) {}

  async execute(input: {
    userId: string;
    companyId: string;
  }): Promise<{ access_token: string; refresh_token: string; company: CompanyInfoDto }> {
    const { userId, companyId } = input;
    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const userCompany = await this.companyAccessRepository.findActiveUserCompany(userId, companyId);

    if (!userCompany) {
      throw new BadRequestException('No tienes acceso a esta compañía');
    }

    const payload: TokenPayload = {
      sub: userId,
      companyId: companyId,
      companyDbName: userCompany.companyDbName,
    };

    const tokens = this.tokenService.generateTokens(payload);

    const company = await this.permissionsRepository.getCompanyWithBranding(companyId);
    if (!company) {
      throw new NotFoundException('Compañía no encontrada');
    }

    const companyInfo: CompanyInfoDto = {
      id: company.id,
      name: company.name,
      shortName: company.name,
      branding: company.branding,
    };

    return { ...tokens, company: companyInfo };
  }
}
