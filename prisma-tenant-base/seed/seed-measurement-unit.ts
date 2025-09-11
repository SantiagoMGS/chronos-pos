import { PrismaClient } from '../tenant-database-client-types';
import { measurementUnitData } from '../data/measurement-unit.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedMeasurementUnits(prisma: PrismaClient) {
  SeedLogger.info('Creando unidades de medida...', '📏');

  for (const unit of measurementUnitData) {
    await prisma.measurementUnit.upsert({
      where: { code: unit.code },
      update: {},
      create: unit,
    });
  }

  SeedLogger.success(`${measurementUnitData.length} unidades de medida procesadas`);
  SeedLogger.complete('Seed de unidades de medida completado');
}
