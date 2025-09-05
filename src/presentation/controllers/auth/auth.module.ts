import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '@domain/use-cases/auth/login.use-case';
import { SetCompanyUseCase } from '../../../domain/use-cases/auth/set-company.use-case';
import { GetPermissionsByCompanyUseCase } from '../../../domain/use-cases/auth/get-permissions-by-company.use-case';
import { TokenService } from '@application/services/auth/token.service';
import { BcryptService } from '@application/services/auth/bcrypt.service';
import { UserFinderService } from '@application/services/user/user-finder.service';
import { UserRepository } from '@domain/repositories/user/user.repository';
import { UserDataSourceService } from '@infrastructure/datasource/user/user.datasource.service';
import { CompanyAccessRepository } from '@domain/repositories/company/company-access.repository';
import { CompanyAccessDataSourceService } from '@infrastructure/datasource/company/company-access.datasource.service';
import { PermissionsRepository } from '@domain/repositories/auth/permissions.repository';
import { PermissionsDataSourceService } from '@infrastructure/datasource/auth/permissions.datasource.service';
import { PrincipalPrismaService } from '@core/services/principal-prisma-client.service';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
import { ResponseInterceptor } from '../../../core/interceptores/response.interceptor';
import { envs } from '@core/config/envs';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpiration },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    SetCompanyUseCase,
    GetPermissionsByCompanyUseCase,
    TokenService,
    BcryptService,
    UserFinderService,
    PrincipalPrismaService,
    JwtStrategy,
    ResponseInterceptor,
    Reflector,
    {
      provide: UserRepository,
      useClass: UserDataSourceService,
    },
    {
      provide: CompanyAccessRepository,
      useClass: CompanyAccessDataSourceService,
    },
    TenantPrismaService,
    {
      provide: PermissionsRepository,
      useClass: PermissionsDataSourceService,
    },
  ],
  exports: [TokenService, BcryptService],
})
export class AuthModule {}
