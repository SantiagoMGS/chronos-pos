export abstract class UserRepository {
  abstract getUserByEmail(email: string): Promise<any>;
  abstract getUserByEmailWithCompanies(email: string): Promise<any>;
  abstract getUserById(id: string): Promise<any>;
}
