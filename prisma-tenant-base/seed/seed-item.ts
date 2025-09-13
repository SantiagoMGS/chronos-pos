import { PrismaClient } from '../tenant-database-client-types';
import { itemData } from '../data/item.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedItems(prisma: PrismaClient) {
  SeedLogger.info('Creando items (productos y servicios)...', '📦');

  for (const item of itemData) {
    await prisma.item.upsert({
      where: { code: item.code },
      update: { ...item, price: Number(item.price) },
      create: item,
    });
  }

  SeedLogger.success(`${itemData.length} items procesados`);
  SeedLogger.complete('Seed de items completado');
}
