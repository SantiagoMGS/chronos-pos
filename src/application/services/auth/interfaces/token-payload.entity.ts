export interface TokenPayload {
  sub: string; // User ID
  roleId?: string; // Role ID del usuario
  companyDbName?: string; // Nombre de la base de datos de la compañía
  companyId?: string; // ID de la compañía
  [key: string]: unknown; // Para propiedades adicionales que puedan ser necesarias
}
