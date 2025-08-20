import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { TokenPayload } from '@application/services/auth/interfaces/token-payload.entity';
import { TokenService } from '@application/services/auth/token.service';
import { UserFinderService } from '@application/services/user/user-finder.service';
import { PrincipalPrismaService } from '@core/services/principal-prisma-client.service';
import { SetCompanyResponseDto } from '@presentation/controllers/auth/dtos/set-company.dto';
import { Request } from 'express';

@Injectable()
export class SetCompanyUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    private readonly tokenService: TokenService,
    private readonly principalPrisma: PrincipalPrismaService,
  ) {}

  async execute(companyId: string, request: Request): Promise<SetCompanyResponseDto> {
    const userId = request.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const userCompany = await this.principalPrisma.client.userCompany.findFirst({
      where: {
        userId: userId,
        companyId: companyId,
        isActive: true,
      },
      include: {
        company: true,
      },
    });

    if (!userCompany) {
      throw new BadRequestException('No tienes acceso a esta compañía');
    }

    const payload: TokenPayload = {
      sub: userId,
      companyId: companyId,
      companyDbName: userCompany.company.dbName,
    };

    const tokens = this.tokenService.generateTokens(payload);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }
}
