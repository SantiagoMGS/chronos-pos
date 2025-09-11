import { Department } from '@domain/entities/department.entity';

export abstract class DepartmentRepository {
  abstract findAll(): Promise<Department[]>;
}
