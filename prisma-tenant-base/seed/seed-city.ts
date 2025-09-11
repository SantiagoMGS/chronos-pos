import { PrismaClient } from '../tenant-database-client-types';
import { cityInitialData } from '../data/cities.data';
import { SeedLogger } from '../utils/seed-logger';
import { v4 as uuidv4 } from 'uuid';

export async function seedCities(prisma: PrismaClient) {
  try {
    SeedLogger.info('Creando ciudades...', '🏙️');

    // Verificar si ya existen ciudades para evitar duplicados
    const cityCount = await prisma.city.count();

    if (cityCount > 0) {
      SeedLogger.info(
        `Ya existen ${cityCount} ciudades en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Configuración para procesamiento por lotes
    const BATCH_SIZE = 50; // Procesar de 50 en 50
    const totalCities = cityInitialData.length;
    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ name: string; error: string }> = [];

    SeedLogger.info(
      `Procesando ${totalCities} ciudades en lotes de ${BATCH_SIZE}...`,
    );

    // Procesar en lotes
    for (let i = 0; i < totalCities; i += BATCH_SIZE) {
      const batch = cityInitialData.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(totalCities / BATCH_SIZE);

      SeedLogger.info(
        `Procesando lote ${batchNumber}/${totalBatches} (${batch.length} ciudades)...`,
      );

      try {
        // Obtener departmentIds para el lote actual
        const departmentNames = [
          ...new Set(batch.map((city) => city.department.connect.name)),
        ];
        const departments = await prisma.department.findMany({
          where: { name: { in: departmentNames } },
          select: { id: true, name: true },
        });

        const departmentMap = new Map(
          departments.map((dept) => [dept.name, dept.id]),
        );

        // Transformar datos para createMany
        const batchData = batch.map((city) => ({
          id: uuidv4(), // Generar UUID automáticamente
          name: city.name,
          daneCode: city.daneCode,
          departmentId: departmentMap.get(city.department.connect.name)!,
        }));

        const result = await prisma.city.createMany({
          data: batchData,
          skipDuplicates: true,
        });

        successCount += result.count;
        SeedLogger.info(
          `Lote ${batchNumber} completado: ${result.count} ciudades creadas`,
        );
      } catch (error: any) {
        SeedLogger.error(`Error en lote ${batchNumber}: ${error.message}`);

        // Si falla el lote completo, intentar uno por uno
        for (const cityData of batch) {
          try {
            const departmentId = await prisma.department.findFirst({
              where: { name: cityData.department.connect.name },
              select: { id: true }
            });

            await prisma.city.create({ 
              data: {
                id: uuidv4(), // Generar UUID automáticamente
                name: cityData.name,
                daneCode: cityData.daneCode,
                departmentId: departmentId!.id,
              }
            });
            successCount++;
          } catch (individualError: any) {
            errorCount++;
            errors.push({
              name: cityData.name,
              error: individualError.message,
            });
            SeedLogger.error(
              `Error al crear ciudad ${cityData.name}: ${individualError.message}`,
            );
          }
        }
      }

      // Pequeña pausa entre lotes para no saturar la base de datos
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    SeedLogger.complete(
      `Seed de ciudades completado: ${successCount} ciudades creadas exitosamente`,
    );

    if (errorCount > 0) {
      SeedLogger.warn(`${errorCount} ciudades fallaron:`);
      errors.slice(0, 10).forEach(({ name, error }) => {
        SeedLogger.warn(`- ${name}: ${error}`);
      });
      if (errors.length > 10) {
        SeedLogger.warn(`... y ${errors.length - 10} errores más`);
      }
    }
  } catch (error: any) {
    SeedLogger.error(`Error general al sembrar ciudades: ${error.message}`);
    throw error;
  }
}
