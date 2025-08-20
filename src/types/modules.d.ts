declare module 'express' {
  export interface Request {
    user?: {
      userId: string;
      id?: string;
      email?: string;
      roleId?: string | null;
      companyDbName?: string | null;
      companyId?: string | null;
      [key: string]: unknown;
    };
  }
}
