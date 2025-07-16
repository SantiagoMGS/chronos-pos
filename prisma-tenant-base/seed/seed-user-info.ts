import { PrismaClient } from '../tenant-database-client-types';
import { userInfoData } from '../data/user-info.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedUserInfo(prisma: PrismaClient) {
  SeedLogger.info('Creando información de usuarios...', '📋');

  for (const userInfo of userInfoData) {
    await prisma.userInfo.upsert({
      where: {
        userId: userInfo.userId,
      },
      update: {},
      create: userInfo,
    });
    SeedLogger.success(`Información creada para usuario: ${userInfo.name}`);
  }

  SeedLogger.complete('Seed de user-info completado');
}
