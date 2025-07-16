import { PrismaClient } from '../../prisma-principal/principal-database-client-types';
import { companyData } from '../data/company.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedCompanies(prisma: PrismaClient) {
  SeedLogger.info('Creando empresas en base de datos principal...', '📊');

  for (const company of companyData) {
    await prisma.company.upsert({
      where: { id: company.id },
      update: {},
      create: company,
    });
    SeedLogger.success(`Empresa creada: ${company.name}`);
  }

  SeedLogger.complete('Seed de empresas completado');
}
