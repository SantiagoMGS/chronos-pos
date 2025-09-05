import { Injectable } from '@nestjs/common';
import {
  CompanyWithBranding,
  PermissionApplication,
  PermissionsRepository,
  RoleInfo,
} from '@domain/repositories/auth/permissions.repository';
import { PrincipalPrismaService } from '@core/services/principal-prisma-client.service';
import { TenantPrismaService } from '@core/services/tenant-prisma-client.service';

@Injectable()
export class PermissionsDataSourceService implements PermissionsRepository {
  constructor(
    private readonly principalPrisma: PrincipalPrismaService,
    private readonly tenantPrisma: TenantPrismaService,
  ) {}

  async getCompanyWithBranding(companyId: string): Promise<CompanyWithBranding | null> {
    const company = await this.principalPrisma.client.company.findUnique({
      where: { id: companyId },
      include: { companyBranding: true },
    });

    if (!company) return null;

    const branding = company.companyBranding?.[0] || null;
    return {
      id: company.id,
      name: company.name,
      branding: branding
        ? {
            logo: branding.logo ?? null,
            primaryColor: branding.primaryColor ?? null,
            secondaryColor: branding.secondaryColor ?? null,
            tertiaryColor: branding.tertiaryColor ?? null,
          }
        : null,
    };
  }

  async getActiveRoleByUserId(userId: string): Promise<RoleInfo | null> {
    const userRole = await this.tenantPrisma.client.userRole.findFirst({
      where: { userId, isActive: true },
      include: { role: true },
    });
    if (!userRole?.role) return null;
    return { id: userRole.role.id, name: userRole.role.name };
  }

  async getApplicationsTreeWithRolePermissions(roleId: string): Promise<PermissionApplication[]> {
    const apps = await this.tenantPrisma.client.application.findMany({
      orderBy: { name: 'asc' },
      include: {
        resources: {
          where: { parentId: null },
          orderBy: { name: 'asc' },
          include: {
            actions: {
              where: { roleActions: { some: { roleId } } },
              select: { id: true, name: true },
              orderBy: { name: 'asc' },
            },
            children: {
              orderBy: { name: 'asc' },
              include: {
                actions: {
                  where: { roleActions: { some: { roleId } } },
                  select: { id: true, name: true },
                  orderBy: { name: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    return apps.map((app) => ({
      id: app.id,
      name: app.name,
      path: app.path,
      resources: app.resources.map((res) => ({
        id: res.id,
        name: res.name,
        icon: res.icon,
        path: res.path,
        actions: res.actions.map((a) => ({ id: a.id, name: a.name })),
        children: res.children.map((child) => ({
          id: child.id,
          name: child.name,
          icon: child.icon,
          path: child.path,
          actions: child.actions.map((a) => ({ id: a.id, name: a.name })),
          children: [],
        })),
      })),
    }));
  }
}
