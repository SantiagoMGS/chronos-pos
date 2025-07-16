import { PrismaClient } from '../tenant-database-client-types';
import { documentTypeData } from '../data/document-type.data';
import { SeedLogger } from '../utils/seed-logger';

export async function seedDocumentTypes(prisma: PrismaClient) {
  SeedLogger.info('Creando tipos de documento...', '📄');

  for (const documentType of documentTypeData) {
    await prisma.documentType.upsert({
      where: { 
        name_code: {
          name: documentType.name,
          code: documentType.code,
        }
      },
      update: {},
      create: documentType,
    });
    SeedLogger.success(`Tipo de documento creado: ${documentType.name} (${documentType.code})`);
  }

  SeedLogger.complete('Seed de tipos de documento completado');
} 