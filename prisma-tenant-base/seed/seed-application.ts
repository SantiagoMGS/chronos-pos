import { PrismaClient } from '../tenant-database-client-types';
import { applicationData } from '../data/application.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedApplications(prisma: PrismaClient) {
  SeedLogger.info('Creando aplicaciones...', '📱');

  for (const application of applicationData) {
    await prisma.application.upsert({
      where: { id: application.id },
      update: {},
      create: application,
    });
  }

  SeedLogger.complete('Seed de aplicaciones completado');
}
