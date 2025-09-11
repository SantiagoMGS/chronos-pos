import { MeasurementUnit } from '@domain/entities/measurement-unit.entity';

export abstract class MeasurementUnitRepository {
  abstract findAll(): Promise<MeasurementUnit[]>;
}
