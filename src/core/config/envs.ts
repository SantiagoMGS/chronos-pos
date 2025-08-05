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
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().default(8443),
    JWT_REFRESH_SECRET: joi.string().default('borealis_dev_refresh'),
    JWT_REFRESH_EXPIRATION: joi.string().default('24h'),
    JWT_EXPIRATION: joi.string().default('8h'),
    JWT_SECRET: joi.string().default('borealis_dev'),

    // Database configuration
    PRINCIPAL_DB_NAME: joi.string().default('principal'),
    PRINCIPAL_DATABASE_URL: joi.string().default('postgresql://postgres:postgres@localhost:5432/principal'),
    TENANT_BASE_DATABASE_URL: joi.string().default('postgresql://postgres:postgres@localhost:5432/base_db'),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  // General configuration
  port: envVars.PORT,

  // Auth configuration
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiration: envVars.JWT_EXPIRATION,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  jwtRefreshExpiration: envVars.JWT_REFRESH_EXPIRATION,

  // Database configuration
  principalDbName: envVars.PRINCIPAL_DB_NAME,
  principalDatabaseUrl: envVars.PRINCIPAL_DATABASE_URL,
  tenantBaseDatabaseUrl: envVars.TENANT_BASE_DATABASE_URL,
};
