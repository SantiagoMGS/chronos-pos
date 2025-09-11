import { Injectable } from '@nestjs/common';
import { Department } from '@domain/entities/department.entity';
import { DepartmentRepository } from '@domain/repositories/department/department.repository';

@Injectable()
export class GetAllDepartmentsUseCase {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async execute(): Promise<Department[]> {
    return await this.departmentRepository.findAll();
  }
}
