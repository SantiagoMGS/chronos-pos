import { Injectable } from '@nestjs/common';
import { MeasurementUnit } from '@domain/entities/measurement-unit.entity';
import { MeasurementUnitRepository } from '@domain/repositories/measurement-unit/measurement-unit.repository';

@Injectable()
export class GetMeasurementUnitsUseCase {
  constructor(private readonly measurementUnitRepository: MeasurementUnitRepository) {}

  async execute(): Promise<MeasurementUnit[]> {
    return await this.measurementUnitRepository.findAll();
  }
}
