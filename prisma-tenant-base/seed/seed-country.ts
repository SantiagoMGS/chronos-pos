import { PrismaClient } from '../tenant-database-client-types';
import { countryInitialData } from '../data/countries.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedCountries(prisma: PrismaClient) {
  SeedLogger.info('Creando países...', '🌍');

  for (const country of countryInitialData) {
    await prisma.country.upsert({
      where: { id: country.id },
      update: {},
      create: country,
    });
  }

  SeedLogger.complete('Seed de países completado');
}
