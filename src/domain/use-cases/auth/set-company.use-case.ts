import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { TokenPayload } from '@application/services/auth/interfaces/token-payload.entity';
import { TokenService } from '@application/services/auth/token.service';
import { UserFinderService } from '@application/services/user/user-finder.service';
import { CompanyAccessRepository } from '@domain/repositories/company/company-access.repository';

@Injectable()
export class SetCompanyUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    private readonly tokenService: TokenService,
    private readonly companyAccessRepository: CompanyAccessRepository,
  ) {}

  async execute(input: {
    userId: string;
    companyId: string;
  }): Promise<{ access_token: string; refresh_token: string }> {
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

    return tokens;
  }
}
