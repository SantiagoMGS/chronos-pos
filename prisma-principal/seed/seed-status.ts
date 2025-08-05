import { PrismaClient } from '../principal-database-client-types';
import { statusData } from '../data/status.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedStatus(prisma: PrismaClient) {
  SeedLogger.info('Creando estados en base de datos principal...', '📊');

  for (const status of statusData) {
    await prisma.status.upsert({
      where: { id: status.id },
      update: {},
      create: status,
    });
    SeedLogger.success(`Estado creado: ${status.name}`);
  }

  SeedLogger.complete('Seed de estados completado');
}
