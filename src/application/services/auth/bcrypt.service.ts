import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_MESSAGE } from '@shared/constants/auth-message';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<void> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      throw new UnauthorizedException(AUTH_MESSAGE.CREDENTIALS_INCORRECT);
    }
  }
}
