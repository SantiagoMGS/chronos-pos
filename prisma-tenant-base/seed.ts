import { SeedLogger } from 'prisma-principal/utils/seed-logger';
import { PrismaClient } from './tenant-database-client-types';
import { companyData } from 'prisma-principal/data/company.data';
import {
  seedApplications,
  seedResources,
  seedActions,
  seedDocumentTypes,
  seedRoles,
  seedRoleActions,
  seedUserRoles,
  seedUserInfo,
} from './seed/';

async function main() {
  for (const company of companyData) {
    SeedLogger.start(`Iniciando seed para la empresa ${company.name}...`);
    const baseTenantUrl = process.env.TENANT_BASE_DATABASE_URL;
    const tenantUrl = `${baseTenantUrl!.replace('base_db', company.dbName)}`;
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: tenantUrl,
        },
      },
    });

    await seedApplications(prisma);
    await seedResources(prisma);
    await seedActions(prisma);
    await seedDocumentTypes(prisma);
    await seedRoles(prisma);
    await seedRoleActions(prisma);
    await seedUserRoles(prisma);
    await seedUserInfo(prisma);

    void prisma.$disconnect();
    SeedLogger.complete(`Seed para la empresa ${company.name} completado exitosamente!`);
  }

  SeedLogger.complete('Seed de empresas completado exitosamente!');
}

main()
  .catch((e) => {
    SeedLogger.error(`Error durante el seed: ${e.message}`);
    process.exit(1);
  })
  .finally(() => {});
