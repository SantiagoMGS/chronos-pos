import { PrismaClient } from '../tenant-database-client-types';
import { SeedLogger } from './seed-logger';
import * as fs from 'fs';
import * as path from 'path';

interface MigrationInfo {
  name: string;
  sql: string;
  timestamp: string;
}

interface CompanyInfo {
  name: string;
  dbName: string;
}

export class TenantSyncManager {
  private migrationsPath: string;

  constructor() {
    this.migrationsPath = path.join(__dirname, '..', 'migrations');
  }

  private async readMigrations(): Promise<MigrationInfo[]> {
    try {
      const migrationDirs = fs
        .readdirSync(this.migrationsPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort();

      const migrations: MigrationInfo[] = [];

      for (const migrationDir of migrationDirs) {
        const migrationPath = path.join(this.migrationsPath, migrationDir, 'migration.sql');

        if (fs.existsSync(migrationPath)) {
          const sql = fs.readFileSync(migrationPath, 'utf-8');
          const timestamp = migrationDir.split('_')[0];

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

  private async getAppliedMigrations(prisma: PrismaClient): Promise<string[]> {
    try {
      const appliedMigrations = await prisma.tenantMigration.findMany({
        select: { name: true },
        orderBy: { createdAt: 'asc' },
      });

      return appliedMigrations.map((migration) => migration.name);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      SeedLogger.warn(`No se pudieron obtener migraciones aplicadas: ${errorMessage}`);
      return [];
    }
  }

  private splitSqlCommands(sql: string): string[] {
    const cleanedSql = sql
      .split('\n')
      .filter((line) => {
        const trimmedLine = line.trim();
        return trimmedLine && !trimmedLine.startsWith('--');
      })
      .join('\n');

    const commands = cleanedSql
      .split(';')
      .map((cmd) => cmd.trim())
      .filter((cmd) => {
        return cmd.length > 0 && cmd !== '';
      });

    return commands;
  }

  private async applyMigrationSql(prisma: PrismaClient, migration: MigrationInfo): Promise<void> {
    try {
      const sqlCommands = this.splitSqlCommands(migration.sql);

      SeedLogger.info(`🔄 Aplicando migración ${migration.name}...`);

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

  private createAdminPrismaClient(): PrismaClient {
    const user = process.env.DB_USER || 'postgres';
    const password = process.env.DB_PASS || 'postgres';
    const host = process.env.DB_HOST || 'localhost';
    const port = Number(process.env.DB_PORT) || 5432;
    const databaseUrl = `postgresql://${user}:${password}@${host}:${port}/postgres`;

    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  private createTenantPrismaClient(dbName: string): PrismaClient {
    const user = process.env.DB_USER || 'postgres';
    const password = process.env.DB_PASS || 'postgres';
    const host = process.env.DB_HOST || 'localhost';
    const port = Number(process.env.DB_PORT) || 5432;
    const databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${dbName}`;

    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

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

  private async createDatabaseIfNotExists(dbName: string): Promise<void> {
    const exists = await this.databaseExists(dbName);

    if (exists) {
      SeedLogger.info(`📁 Base de datos ${dbName} ya existe`);
      return;
    }

    SeedLogger.info(`🆕 Creando base de datos ${dbName}...`);

    const adminPrisma = this.createAdminPrismaClient();

    try {
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

  private async syncTenantDatabase(companyName: string, dbName: string): Promise<void> {
    SeedLogger.info(`🔄 Sincronizando base de datos tenant: ${companyName} (${dbName})`, '🏢');

    try {
      await this.createDatabaseIfNotExists(dbName);

      const tenantPrisma = this.createTenantPrismaClient(dbName);

      try {
        const availableMigrations = await this.readMigrations();
        SeedLogger.info(`📁 Migraciones disponibles: ${availableMigrations.length}`);

        const appliedMigrations = await this.getAppliedMigrations(tenantPrisma);
        SeedLogger.info(`✅ Migraciones ya aplicadas: ${appliedMigrations.length}`);

        const pendingMigrations = availableMigrations.filter(
          (migration) => !appliedMigrations.includes(migration.name),
        );

        if (pendingMigrations.length === 0) {
          SeedLogger.success(`✨ Base de datos ${companyName} ya está actualizada`);
          return;
        }

        const migrationNames = pendingMigrations.map((m) => m.name).join(', ');
        SeedLogger.info(`🔄 Aplicando ${pendingMigrations.length} migraciones pendientes: ${migrationNames}`);

        for (const migration of pendingMigrations) {
          await this.applyMigrationSql(tenantPrisma, migration);
        }

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

  async syncSpecificTenant(companyName: string, dbName: string): Promise<void> {
    SeedLogger.start(`🚀 Iniciando sincronización para tenant específico: ${companyName}`);
    await this.syncTenantDatabase(companyName, dbName);
    SeedLogger.complete('🎉 Sincronización completada exitosamente!');
  }

  async syncTenantList(companies: CompanyInfo[]): Promise<void> {
    SeedLogger.start('🚀 Iniciando sincronización de bases de datos tenant...');

    try {
      SeedLogger.info(`🏢 Compañías a sincronizar: ${companies.length}`);

      for (const company of companies) {
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

async function main() {
  const syncManager = new TenantSyncManager();

  const { companyData } = await import('../../prisma-principal/data/company.data');

  const companies: CompanyInfo[] = companyData.map((company) => ({
    name: company.name,
    dbName: company.dbName,
  }));

  await syncManager.syncTenantList(companies);
}

if (require.main === module) {
  main().catch((error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    SeedLogger.error(`❌ Error fatal: ${errorMessage}`);
    process.exit(1);
  });
}
