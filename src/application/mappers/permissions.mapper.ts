import {
  ActionNameResponseDto,
  PermissionsByCompanyResponseDto,
} from '@presentation/controllers/auth/dtos/permissions-response.dto';
import { CompanyWithBranding, PermissionApplication, RoleInfo } from '@domain/repositories/auth/permissions.repository';

export class PermissionsMapper {
  static toPermissionsByCompanyResponse(
    role: RoleInfo,
    applications: PermissionApplication[],
  ): PermissionsByCompanyResponseDto {
    return {
      role: {
        id: role.id,
        name: role.name,
      },
      applications: applications.map((app) => ({
        id: app.id,
        name: app.name,
        path: app.path,
        isActive: true,
        resources: app.resources.map((res) => ({
          id: res.id,
          name: res.name,
          icon: res.icon,
          path: res.path,
          subresources: res.children.map((child) => ({
            id: child.id,
            name: child.name,
            icon: child.icon,
            path: child.path,
            action: child.actions[0] ? { name: child.actions[0].name } : { name: '' },
          })),
          actions:
            res.children.length === 0 && res.actions.length > 0
              ? res.actions.map((a) => ({ name: a.name }))
              : undefined,
        })),
      })),
    };
  }
}
