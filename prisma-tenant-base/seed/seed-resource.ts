import { PrismaClient } from '../tenant-database-client-types';
import { resourceData, childrenResource } from '../data/resource.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedResources(prisma: PrismaClient) {
  // Crear recursos padre primero
  SeedLogger.info('Creando recursos padre...', '🔧');

  for (const resource of resourceData) {
    await prisma.resource.upsert({
      where: { id: resource.id },
      update: {},
      create: resource,
    });
  }

  // Crear recursos hijos después
  SeedLogger.info('Creando recursos hijos...', '🔗');

  for (const childResource of childrenResource) {
    await prisma.resource.upsert({
      where: { id: childResource.id },
      update: {},
      create: childResource,
    });
  }

  SeedLogger.complete('Seed de recursos completado');
}
