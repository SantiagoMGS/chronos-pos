import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TOKEN_MESSAGE } from '@shared/constants/token-message';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from '@core/config/envs';
import { Request } from 'express';
import { TokenPayload } from '@application/services/auth/interfaces/token-payload.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw Error('JWT_SECRET no está configurado en las variables de entorno');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      throw new UnauthorizedException(TOKEN_MESSAGE.TOKEN_NOT_FOUND);
    }

    return {
      userId: payload.sub,
      roleId: payload.roleId || null,
      companyDbName: payload.companyDbName || null,
      companyId: payload.companyId || null,
    };
  }
}
