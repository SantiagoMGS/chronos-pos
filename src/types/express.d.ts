import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        roleId?: string | null;
        companyDbName?: string | null;
        companyId?: string | null;
        [key: string]: any;
      };
    }
  }
}
