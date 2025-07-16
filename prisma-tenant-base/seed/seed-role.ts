import { PrismaClient } from '../tenant-database-client-types';
import { roleData } from '../data/role.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedRoles(prisma: PrismaClient) {
  SeedLogger.info('Creando roles...', '👥');

  for (const role of roleData) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    });
    SeedLogger.success(`Rol creado: ${role.name}`);
  }

  SeedLogger.complete('Seed de roles completado');
} 