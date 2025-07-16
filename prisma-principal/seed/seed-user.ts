import { PrismaClient } from '../../prisma-principal/principal-database-client-types';
import { userData } from '../data/user.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedUsers(prisma: PrismaClient) {
  SeedLogger.info('Creando usuarios en base de datos principal...', '📊');

  for (const user of userData) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
    SeedLogger.success(`Usuario creado: ${user.email}`);
  }

  SeedLogger.complete('Seed de usuarios completado');
}
