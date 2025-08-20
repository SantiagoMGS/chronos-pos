export type ActiveUserCompany = {
  companyDbName: string;
};

export abstract class CompanyAccessRepository {
  abstract findActiveUserCompany(userId: string, companyId: string): Promise<ActiveUserCompany | null>;
}
