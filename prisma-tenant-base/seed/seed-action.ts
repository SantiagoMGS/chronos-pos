import { PrismaClient } from '../tenant-database-client-types';
import { actionData } from '../data/action.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedActions(prisma: PrismaClient) {
  SeedLogger.info('Eliminando acciones existentes...', '🗑️');

  await prisma.action.deleteMany({});
  SeedLogger.success('Acciones existentes eliminadas');

  SeedLogger.info('Obteniendo recursos para mapear IDs...', '📋');

  const resources = await prisma.resource.findMany({
    select: { id: true, name: true },
  });

  const resourceMap = new Map(resources.map((r) => [r.name, r.id]));

  const actionsForCreateMany: { id: string; name: string; description: string | null; resourceId: string }[] =
    actionData.map((action) => ({
      id: action.id!,
      name: action.name,
      description: action.description || null,
      resourceId: resourceMap.get((action.resource as any).connect.name)!,
    }));

  SeedLogger.info('Creando acciones en bloques...', '🔐');

  const BLOCK_SIZE = 10;
  const blocks: Array<{ id: string; name: string; description: string | null; resourceId: string }[]> = [];

  for (let i = 0; i < actionsForCreateMany.length; i += BLOCK_SIZE) {
    blocks.push(actionsForCreateMany.slice(i, i + BLOCK_SIZE));
  }

  let totalCreated = 0;
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    await prisma.action.createMany({
      data: block,
      skipDuplicates: true,
    });

    totalCreated += block.length;
    SeedLogger.info(`Bloque ${i + 1}/${blocks.length} completado (${block.length} acciones)`);

    if (i < blocks.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  SeedLogger.success(`${totalCreated} acciones creadas en ${blocks.length} bloques`);
  SeedLogger.complete('Seed de acciones completado');
}
