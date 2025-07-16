import { PrismaClient } from '../tenant-database-client-types';
import { companyData } from '../../prisma-principal/data/company.data';
import { SeedLogger } from './seed-logger';
import * as fs from 'fs';
import * as path from 'path';

interface MigrationInfo {
  name: string;
  sql: string;
  timestamp: string;
}

export class TenantSyncManager {
  private migrationsPath: string;

  constructor() {
    this.migrationsPath = path.join(__dirname, '..', 'migrations');
  }

  /**
   * Lee todas las migraciones disponibles del directorio
   */
  private async readMigrations(): Promise<MigrationInfo[]> {
    try {
      const migrationDirs = fs
        .readdirSync(this.migrationsPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort(); // Ordena por timestamp

      const migrations: MigrationInfo[] = [];

      for (const migrationDir of migrationDirs) {
        const migrationPath = path.join(this.migrationsPath, migrationDir, 'migration.sql');

        if (fs.existsSync(migrationPath)) {
          const sql = fs.readFileSync(migrationPath, 'utf-8');
          const timestamp = migrationDir.split('_')[0]; // Extrae el timestamp

          migrations.push({
            name: migrationDir,
            sql,
            timestamp,
          });
        }
      }

      return migrations;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      SeedLogger.error(`Error leyendo migraciones: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Obtiene las migraciones ya aplicadas en una base de datos tenant
   */
  private async getAppliedMigrations(prisma: PrismaClient): Promise<string[]> {
    try {
      const appliedMigrations = await prisma.tenantMigration.findMany({
        select: { name: true },
        orderBy: { createdAt: 'asc' },
      });

      return appliedMigrations.map((migration) => migration.name);
    } catch (error) {
      // Si la tabla no existe, retornamos array vacío
      const errorMessage = error instanceof Error ? error.message : String(error);
      SeedLogger.warn(`No se pudieron obtener migraciones aplicadas: ${errorMessage}`);
      return [];
    }
  }

  /**
   * Divide el SQL en comandos individuales
   */
  private splitSqlCommands(sql: string): string[] {
    // Remover comentarios de línea completa y limpiar el SQL
    const cleanedSql = sql
      .split('\n')
      .filter((line) => {
        const trimmedLine = line.trim();
        return trimmedLine && !trimmedLine.startsWith('--');
      })
      .join('\n');

    // Dividir por punto y coma
    const commands = cleanedSql
      .split(';')
      .map((cmd) => cmd.trim())
      .filter((cmd) => {
        // Filtrar comandos vacíos
        return cmd.length > 0 && cmd !== '';
      });

    return commands;
  }

  /**
   * Aplica una migración SQL a la base de datos (solo el SQL, sin registrar)
   */
  private async applyMigrationSql(prisma: PrismaClient, migration: MigrationInfo): Promise<void> {
    try {
      // Dividir el SQL en comandos individuales
      const sqlCommands = this.splitSqlCommands(migration.sql);

      SeedLogger.info(`🔄 Aplicando migración ${migration.name}...`);

      // Ejecutar cada comando SQL individualmente
      for (const command of sqlCommands) {
        if (command.trim()) {
          try {
            await prisma.$executeRawUnsafe(command);
          } catch (cmdError) {
            const errorMessage = cmdError instanceof Error ? cmdError.message : String(cmdError);
            SeedLogger.error(`❌ Error ejecutando comando SQL: ${command.substring(0, 100)}...`);
            SeedLogger.error(`❌ Detalle del error: ${errorMessage}`);
            throw cmdError;
          }
        }
      }

      SeedLogger.success(`✅ Migración SQL aplicada: ${migration.name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      SeedLogger.error(`❌ Error aplicando migración SQL ${migration.name}: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Registra una migración como aplicada en tenant_migration
   */
  private async registerMigration(prisma: PrismaClient, migrationName: string): Promise<void> {
    try {
      await prisma.tenantMigration.create({
        data: {
          name: migrationName,
        },
      });
      SeedLogger.success(`📝 Migración registrada: ${migrationName}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      SeedLogger.error(`❌ Error registrando migración ${migrationName}: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Crea una conexión administrativa para crear bases de datos
   */
  private createAdminPrismaClient(): PrismaClient {
    const port = process.env.DB_PORT || 5432;
    const databaseUrl = `postgresql://postgres:postgres@localhost:${port}/postgres`;

    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  /**
   * Crea una conexión a la base de datos tenant
   */
  private createTenantPrismaClient(dbName: string): PrismaClient {
    const port = process.env.DB_PORT || 5432;
    const databaseUrl = `postgresql://postgres:postgres@localhost:${port}/${dbName}`;

    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  /**
   * Verifica si una base de datos existe
   */
  private async databaseExists(dbName: string): Promise<boolean> {
    const adminPrisma = this.createAdminPrismaClient();

    try {
      const result = await adminPrisma.$queryRaw<{ exists: boolean }[]>`
        SELECT EXISTS(
          SELECT 1 FROM pg_database WHERE datname = ${dbName}
        ) as exists;
      `;

      return result[0]?.exists || false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      SeedLogger.error(`❌ Error verificando base de datos ${dbName}: ${errorMessage}`);
      return false;
    } finally {
      await adminPrisma.$disconnect();
    }
  }

  /**
   * Crea una base de datos tenant si no existe
   */
  private async createDatabaseIfNotExists(dbName: string): Promise<void> {
    const exists = await this.databaseExists(dbName);

    if (exists) {
      SeedLogger.info(`📁 Base de datos ${dbName} ya existe`);
      return;
    }

    SeedLogger.info(`🆕 Creando base de datos ${dbName}...`);

    const adminPrisma = this.createAdminPrismaClient();

    try {
      // Crear la base de datos usando SQL sin comillas identificadoras
      await adminPrisma.$executeRawUnsafe(`CREATE DATABASE ${dbName};`);
      SeedLogger.success(`✅ Base de datos ${dbName} creada exitosamente`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      SeedLogger.error(`❌ Error creando base de datos ${dbName}: ${errorMessage}`);
      throw error;
    } finally {
      await adminPrisma.$disconnect();
    }
  }

  /**
   * Sincroniza una base de datos tenant específica
   */
  private async syncTenantDatabase(companyName: string, dbName: string): Promise<void> {
    SeedLogger.info(`🔄 Sincronizando base de datos tenant: ${companyName} (${dbName})`, '🏢');

    try {
      // Verificar y crear la base de datos si no existe
      await this.createDatabaseIfNotExists(dbName);

      const tenantPrisma = this.createTenantPrismaClient(dbName);

      try {
        // Leer todas las migraciones disponibles
        const availableMigrations = await this.readMigrations();
        SeedLogger.info(`📁 Migraciones disponibles: ${availableMigrations.length}`);

        // Obtener migraciones ya aplicadas
        const appliedMigrations = await this.getAppliedMigrations(tenantPrisma);
        SeedLogger.info(`✅ Migraciones ya aplicadas: ${appliedMigrations.length}`);

        // Filtrar migraciones pendientes
        const pendingMigrations = availableMigrations.filter(
          (migration) => !appliedMigrations.includes(migration.name),
        );

        if (pendingMigrations.length === 0) {
          SeedLogger.success(`✨ Base de datos ${companyName} ya está actualizada`);
          return;
        }

        const migrationNames = pendingMigrations.map((m) => m.name).join(', ');
        SeedLogger.info(`🔄 Aplicando ${pendingMigrations.length} migraciones pendientes: ${migrationNames}`);

        // Aplicar todas las migraciones SQL primero (sin registrar)
        for (const migration of pendingMigrations) {
          await this.applyMigrationSql(tenantPrisma, migration);
        }

        // Solo después de que todas las migraciones se apliquen exitosamente,
        // registrar cada una en la tabla tenant_migration
        SeedLogger.info('📝 Registrando migraciones aplicadas...');
        for (const migration of pendingMigrations) {
          await this.registerMigration(tenantPrisma, migration.name);
        }

        SeedLogger.complete(`🎉 Sincronización completada para ${companyName}`);
      } finally {
        await tenantPrisma.$disconnect();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      SeedLogger.error(`❌ Error sincronizando ${companyName}: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Sincroniza todas las bases de datos tenant
   */
  async syncAllTenants(): Promise<void> {
    SeedLogger.start('🚀 Iniciando sincronización de bases de datos tenant...');

    try {
      SeedLogger.info(`🏢 Compañías a sincronizar: ${companyData.length}`);

      for (const company of companyData) {
        await this.syncTenantDatabase(company.name, company.dbName);
      }

      SeedLogger.complete('🎉 Sincronización de todas las bases de datos tenant completada exitosamente!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      SeedLogger.error(`❌ Error durante la sincronización: ${errorMessage}`);
      throw error;
    }
  }
}

// Función principal para ejecutar el script
async function main() {
  const syncManager = new TenantSyncManager();
  await syncManager.syncAllTenants();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch((error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    SeedLogger.error(`❌ Error fatal: ${errorMessage}`);
    process.exit(1);
  });
}
