import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AUTH_MESSAGE } from '@shared/constants/auth-message';

export const CurrentUser = createParamDecorator((property: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!user) {
    throw new UnauthorizedException(AUTH_MESSAGE.USER_NOT_FOUND);
  }

  if (property) {
    const value = user[property];

    if (value === undefined || value === null) {
      throw new UnauthorizedException(AUTH_MESSAGE.USER_NOT_FOUND);
    }

    return value;
  }

  return user;
});
