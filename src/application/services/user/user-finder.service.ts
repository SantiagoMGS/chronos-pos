import { UserRepository } from '@domain/repositories/user/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AUTH_MESSAGE } from '@shared/constants/auth-message';

@Injectable()
export class UserFinderService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByEmail(email: string): Promise<any> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGE.USER_NOT_FOUND);
    }

    if (user.userCompanies.length === 0) {
      throw new NotFoundException(AUTH_MESSAGE.USER_COMPANY_NOT_FOUND);
    }

    return user;
  }

  async findUserByEmailWithCompanies(email: string): Promise<any> {
    const user = await this.userRepository.getUserByEmailWithCompanies(email);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGE.USER_NOT_FOUND);
    }

    if (user.userCompanies.length === 0) {
      throw new NotFoundException(AUTH_MESSAGE.USER_COMPANY_NOT_FOUND);
    }

    return user;
  }

  async findUserById(userId: string): Promise<any> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGE.USER_NOT_FOUND);
    }
    return user;
  }
}
