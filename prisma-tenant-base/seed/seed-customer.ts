import { PrismaClient } from '../tenant-database-client-types';
import { customerData } from '../data/customer.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedCustomers(prisma: PrismaClient) {
  SeedLogger.info('Creando clientes...', '👥');

  for (const customer of customerData) {
    await prisma.customer.upsert({
      where: { documentNumber: customer.documentNumber },
      update: {},
      create: customer,
    });
  }

  SeedLogger.success(`${customerData.length} clientes procesados`);
  SeedLogger.complete('Seed de clientes completado');
}
