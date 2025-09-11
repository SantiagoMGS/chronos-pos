import { PrismaClient } from '../tenant-database-client-types';
import { departmentInitialData } from '../data/departments.data';
import { SeedLogger } from '../utils/seed-logger';
import { v4 as uuidv4 } from 'uuid';

export async function seedDepartments(prisma: PrismaClient) {
  try {
    SeedLogger.info('Creando departamentos...', '🗺️');

    // Verificar si ya existen departamentos para evitar duplicados
    const departmentCount = await prisma.department.count();

    if (departmentCount > 0) {
      SeedLogger.info(
        `Ya existen ${departmentCount} departamentos en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Obtener el país de referencia (Colombia)
    const country = await prisma.country.findFirst({
      where: { name: 'Colombia' },
      select: { id: true }
    });

    if (!country) {
      SeedLogger.error('No se encontró el país Colombia. Ejecuta primero seedCountries.');
      throw new Error('País Colombia no encontrado');
    }

    // Crear departamentos
    for (const departmentData of departmentInitialData) {
      await prisma.department.create({
        data: {
          id: uuidv4(),
          name: departmentData.name,
          daneCode: departmentData.daneCode,
          countryId: country.id,
        }
      });
    }

    SeedLogger.complete(`Seed de departamentos completado: ${departmentInitialData.length} departamentos creados`);
  } catch (error: any) {
    SeedLogger.error(`Error general al sembrar departamentos: ${error.message}`);
    throw error;
  }
}