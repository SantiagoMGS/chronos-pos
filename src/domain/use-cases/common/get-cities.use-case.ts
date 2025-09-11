import { Injectable } from '@nestjs/common';
import { City } from '@domain/entities/city.entity';
import { CityRepository } from '@domain/repositories/city/city.repository';

@Injectable()
export class GetCitiesUseCase {
  constructor(private readonly cityRepository: CityRepository) {}

  async execute(departmentId?: string): Promise<City[]> {
    if (departmentId) {
      return await this.cityRepository.findByDepartment(departmentId);
    }
    return await this.cityRepository.findAll();
  }
}
