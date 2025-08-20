export type CompanyBranding = {
  logo: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  tertiaryColor: string | null;
};

export type Company = {
  id: string;
  name: string;
  shortName?: string | null;
  dbName: string;
  companyBranding?: CompanyBranding[];
};

export type UserCompany = {
  company: Company;
  isActive: boolean;
};

export type UserCredential = {
  hashedPassword: string;
  isActive: boolean;
};

export type User = {
  id: string;
  email: string;
  userCompanies: UserCompany[];
  userCredentials: UserCredential[];
};
