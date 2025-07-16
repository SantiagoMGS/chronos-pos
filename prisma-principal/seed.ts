import { PrismaClient } from '../prisma-principal/principal-database-client-types';
import { seedCompanies, seedUsers } from './seed/';
import { SeedLogger } from './utils/seed-logger';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PRINCIPAL_DATABASE_URL,
    },
  },
});

async function main() {
  SeedLogger.start('Iniciando seed de la base de datos principal...');

  await seedCompanies(prisma);
  await seedUsers(prisma);

  SeedLogger.complete('Seed de la base de datos principal completado exitosamente!');
}

main()
  .catch((e) => {
    SeedLogger.error(`Error durante el seed: ${e.message}`);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
