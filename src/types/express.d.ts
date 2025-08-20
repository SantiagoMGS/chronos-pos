import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        companyDbName: string;
        companyId: string;
        [key: string]: any;
      };
    }
  }
}
