import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '@domain/use-cases/auth/login.use-case';
import { SetCompanyUseCase } from '../../../domain/use-cases/auth/set-company.use-case';
import { TokenService } from '@application/services/auth/token.service';
import { BcryptService } from '@application/services/auth/bcrypt.service';
import { UserFinderService } from '@application/services/user/user-finder.service';
import { UserRepository } from '@domain/repositories/user/user.repository';
import { UserDataSourceService } from '@infrastructure/datasource/user/user.datasource.service';
import { PrincipalPrismaService } from '@core/services/principal-prisma-client.service';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
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
    TokenService,
    BcryptService,
    UserFinderService,
    PrincipalPrismaService,
    JwtStrategy,
    {
      provide: UserRepository,
      useClass: UserDataSourceService,
    },
  ],
  exports: [TokenService, BcryptService],
})
export class AuthModule {}
