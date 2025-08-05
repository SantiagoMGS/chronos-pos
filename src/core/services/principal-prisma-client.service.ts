import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma-principal/principal-database-client-types';

const getPrisma = () => new PrismaClient();

const globalForPrincipalDBPrismaClient = global as unknown as {
  principalDBPrismaClient: ReturnType<typeof getPrisma>;
};

export const principalDBPrismaClient = globalForPrincipalDBPrismaClient.principalDBPrismaClient || getPrisma();

// Servicio inyectable para el cliente principal
@Injectable()
export class PrincipalPrismaService {
  private readonly _client: PrismaClient;

  constructor() {
    this._client = principalDBPrismaClient;
  }

  // Getter para acceder al cliente
  get client(): PrismaClient {
    return this._client;
  }

  // Métodos de conveniencia para operaciones comunes
  async $connect() {
    return this._client.$connect();
  }

  async $disconnect() {
    return this._client.$disconnect();
  }

  async $transaction<T>(
    fn: (
      prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
    ) => Promise<T>,
  ) {
    return this._client.$transaction(fn);
  }
}

if (process.env.NODE_ENV !== 'production')
  globalForPrincipalDBPrismaClient.principalDBPrismaClient = principalDBPrismaClient;
