import { PrismaClient } from '../tenant-database-client-types';
import { roleActionData } from '../data/role-action.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedRoleActions(prisma: PrismaClient) {
  SeedLogger.info('Asignando acciones a roles...', '🔑');

  for (const roleAction of roleActionData) {
    const role = await prisma.role.findUnique({
      where: { name: (roleAction.role as any).connect.name },
      select: { id: true },
    });

    const action = await prisma.action.findUnique({
      where: { name: (roleAction.action as any).connect.name },
      select: { id: true },
    });

    if (!role || !action) {
      SeedLogger.warn(
        `Saltando asignación: Role '${(roleAction.role as any).connect.name}' o Action '${(roleAction.action as any).connect.name}' no encontrado`,
      );
      continue;
    }

    await prisma.roleAction.upsert({
      where: {
        roleId_actionId: {
          roleId: role.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        roleId: role.id,
        actionId: action.id,
      },
    });
  }

  SeedLogger.success(`${roleActionData.length} permisos asignados al rol`);
  SeedLogger.complete('Seed de role-actions completado');
}
