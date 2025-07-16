import { PrismaClient } from '../tenant-database-client-types';
import { userRoleData } from '../data/user-role.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedUserRoles(prisma: PrismaClient) {
  SeedLogger.info('Asignando roles a usuarios...', '👤');

  for (const userRole of userRoleData) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: userRole.userId,
          roleId: (userRole.role as any).connect.id,
        },
      },
      update: {},
      create: {
        userId: userRole.userId,
        roleId: (userRole.role as any).connect.id,
      },
    });
    SeedLogger.success(`Rol asignado al usuario: ${userRole.userId}`);
  }

  SeedLogger.complete('Seed de user-roles completado');
} 