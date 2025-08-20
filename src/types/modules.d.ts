declare module 'express' {
  export interface Request {
    user?: {
      id: string;
      email?: string;
      companyDbName: string;
      companyId: string;
      [key: string]: any;
    };
  }
}
