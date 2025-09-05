export interface TokenPayload {
  sub: string;
  roleId?: string;
  companyDbName?: string;
  companyId?: string;
  [key: string]: unknown;
}
