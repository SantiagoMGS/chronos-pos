import { PrismaClient } from '../tenant-database-client-types';
import { actionData } from '../data/action.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedActions(prisma: PrismaClient) {
  SeedLogger.info('Creando acciones...', '🔐');

  for (const action of actionData) {
    await prisma.action.upsert({
      where: { id: action.id },
      update: {},
      create: action,
    });
  }

  SeedLogger.complete('Seed de acciones completado');
}
