import { User } from '@domain/entities/user.entity';

export abstract class UserRepository {
  abstract getUserByEmail(email: string): Promise<User | null>;
  abstract getUserByEmailWithCompanies(email: string): Promise<User | null>;
  abstract getUserById(id: string): Promise<User | null>;
}
