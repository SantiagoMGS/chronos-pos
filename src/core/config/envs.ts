import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;
  JWT_EXPIRATION: string;
  JWT_SECRET: string;
  PRINCIPAL_DB_NAME: string;
  PRINCIPAL_DATABASE_URL: string;
  TENANT_BASE_DATABASE_URL: string;
  DB_USER?: string;
  DB_PASS?: string;
  DB_HOST?: string;
  DB_PORT?: number;
  FACTUS_CLIENT_ID: string;
  FACTUS_CLIENT_SECRET: string;
  FACTUS_USERNAME: string;
  FACTUS_PASSWORD: string;
  FACTUS_BASE_URL: string;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().integer().min(1).max(65535).required(),
    JWT_REFRESH_SECRET: joi.string().min(1).required(),
    JWT_REFRESH_EXPIRATION: joi.string().min(1).required(),
    JWT_EXPIRATION: joi.string().min(1).required(),
    JWT_SECRET: joi.string().min(1).required(),

    PRINCIPAL_DB_NAME: joi.string().min(1).required(),
    PRINCIPAL_DATABASE_URL: joi.string().min(1).required(),
    TENANT_BASE_DATABASE_URL: joi.string().min(1).required(),

    DB_USER: joi.string().optional(),
    DB_PASS: joi.string().optional(),
    DB_HOST: joi.string().optional(),
    DB_PORT: joi.number().integer().min(1).max(65535).optional(),

    FACTUS_CLIENT_ID: joi.string().min(1).required(),
    FACTUS_CLIENT_SECRET: joi.string().min(1).required(),
    FACTUS_USERNAME: joi.string().min(1).required(),
    FACTUS_PASSWORD: joi.string().min(1).required(),
    FACTUS_BASE_URL: joi.string().min(1).required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env, { abortEarly: false, allowUnknown: true, convert: true });

if (error) {
  const details = error.details
    .map((d) => `- ${d.context?.key}: ${d.message.replace(/\"/g, '"').replace(/"/g, '')}`)
    .join('\n');
  throw new Error(`Error en configuración de variables de entorno:\n${details}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  jwtSecret: envVars.JWT_SECRET,
  jwtExpiration: envVars.JWT_EXPIRATION,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  jwtRefreshExpiration: envVars.JWT_REFRESH_EXPIRATION,

  principalDbName: envVars.PRINCIPAL_DB_NAME,
  principalDatabaseUrl: envVars.PRINCIPAL_DATABASE_URL,
  tenantBaseDatabaseUrl: envVars.TENANT_BASE_DATABASE_URL,
  dbUser: envVars.DB_USER,
  dbPass: envVars.DB_PASS,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,

  factusClientId: envVars.FACTUS_CLIENT_ID,
  factusClientSecret: envVars.FACTUS_CLIENT_SECRET,
  factusUsername: envVars.FACTUS_USERNAME,
  factusPassword: envVars.FACTUS_PASSWORD,
  factusBaseUrl: envVars.FACTUS_BASE_URL,
};
