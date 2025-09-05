export type CompanyWithBranding = {
  id: string;
  name: string;
  branding: {
    logo: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
    tertiaryColor: string | null;
  } | null;
};

export type RoleInfo = {
  id: string;
  name: string;
};

export type PermissionAction = { id: string; name: string };
export type PermissionResource = {
  id: string;
  name: string;
  icon: string;
  path: string;
  actions: PermissionAction[];
  children: PermissionResource[];
};
export type PermissionApplication = {
  id: string;
  name: string;
  path: string;
  resources: PermissionResource[];
};

export abstract class PermissionsRepository {
  abstract getCompanyWithBranding(companyId: string): Promise<CompanyWithBranding | null>;
  abstract getActiveRoleByUserId(userId: string): Promise<RoleInfo | null>;
  abstract getApplicationsTreeWithRolePermissions(roleId: string): Promise<PermissionApplication[]>;
}
