import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PrismaClient } from '@prisma-tenant-base/tenant-database-client-types';

const getTenantPrisma = (companyDbName: string, request?: Request, middleware?: any) => {
  if (!companyDbName) {
    throw new Error('Database name (companyDbName) is required');
  }

  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 5432;

  const url = `postgresql://${user}:${password}@${host}:${port}/${companyDbName}`;

  const client = new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
  });

  if (middleware) client.$use(middleware);

  return client;
};

const globalForTenantClients = global as unknown as {
  tenantPrismaClients: Map<string, { client: ReturnType<typeof getTenantPrisma>; request?: Request }>;
  auditMiddleware: any;
};

export const tenantPrismaClients =
  globalForTenantClients.tenantPrismaClients ||
  new Map<string, { client: ReturnType<typeof getTenantPrisma>; request?: Request }>();

export const setAuditMiddleware = (middleware: any) => {
  globalForTenantClients.auditMiddleware = middleware;
};

export const getTenantPrismaClient = (companyDbName: string, request?: Request): PrismaClient => {
  if (!tenantPrismaClients.has(companyDbName)) {
    const client = getTenantPrisma(companyDbName, request, globalForTenantClients.auditMiddleware);
    tenantPrismaClients.set(companyDbName, { client, request });
  }
  return tenantPrismaClients.get(companyDbName)!.client;
};

export const getTenantRequest = (companyDbName: string): Request | undefined => {
  return tenantPrismaClients.get(companyDbName)?.request;
};

@Injectable({ scope: Scope.REQUEST })
export class TenantPrismaService {
  private _client: PrismaClient | null = null;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  get client(): PrismaClient {
    if (!this._client) {
      const user = this.request.user as any;
      if (!user?.companyDbName) {
        throw new Error(
          'No se encontró información de la empresa en el token. Asegúrate de estar autenticado y haber seleccionado una empresa.',
        );
      }
      this._client = getTenantPrismaClient(user.companyDbName, this.request);
    }
    return this._client;
  }

  async $connect() {
    return this.client.$connect();
  }

  async $disconnect() {
    return this.client.$disconnect();
  }

  async $transaction<T>(
    fn: (
      prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
    ) => Promise<T>,
  ) {
    return this.client.$transaction(fn);
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForTenantClients.tenantPrismaClients = tenantPrismaClients;
}
