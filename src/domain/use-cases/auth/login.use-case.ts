import { BcryptService } from '@application/services/auth/bcrypt.service';
import { TokenPayload } from '@application/services/auth/interfaces/token-payload.entity';
import { TokenService } from '@application/services/auth/token.service';
import { UserFinderService } from '@application/services/user/user-finder.service';
import { Injectable } from '@nestjs/common';
import { LoginResponseDto } from '@presentation/controllers/auth/dtos/login-response.dto';
import { LoginDto } from '@presentation/controllers/auth/dtos/login.dto';
import { Request } from 'express';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    private readonly bcryptService: BcryptService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(loginData: LoginDto, request: Request): Promise<LoginResponseDto> {
    const user = await this.userFinderService.findUserByEmailWithCompanies(loginData.email);

    const currentPassword = user.userCredentials[0];
    await this.bcryptService.comparePassword(loginData.password, currentPassword.hashedPassword);

    const payload: TokenPayload = {
      sub: user.id,
    };
    const tokens = this.tokenService.generateTokens(payload);

    return {
      userId: user.id,
      tokens,
      companies: user.userCompanies.map((uc) => ({
        id: uc.company.id,
        name: uc.company.name,
        shortName: uc.company.shortName || '',
      })),
    };
  }
}
