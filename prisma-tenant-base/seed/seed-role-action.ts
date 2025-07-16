import { PrismaClient } from '../tenant-database-client-types';
import { roleActionData } from '../data/role-action.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedRoleActions(prisma: PrismaClient) {
  SeedLogger.info('Asignando acciones a roles...', '🔑');

  for (const roleAction of roleActionData) {
    await prisma.roleAction.upsert({
      where: {
        roleId_actionId: {
          roleId: (roleAction.role as any).connect.id,
          actionId: (roleAction.action as any).connect.id,
        },
      },
      update: {},
      create: {
        roleId: (roleAction.role as any).connect.id,
        actionId: (roleAction.action as any).connect.id,
      },
    });
  }

  SeedLogger.success(`${roleActionData.length} permisos asignados al rol`);
  SeedLogger.complete('Seed de role-actions completado');
} 