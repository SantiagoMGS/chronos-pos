import { City } from '@domain/entities/city.entity';

export abstract class CityRepository {
  abstract findAll(): Promise<City[]>;
  abstract findByDepartment(departmentId: string): Promise<City[]>;
}
