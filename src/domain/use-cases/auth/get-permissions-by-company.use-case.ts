import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PermissionsByCompanyResponseDto } from '@presentation/controllers/auth/dtos/permissions-response.dto';
import { CurrentUserDto } from '@presentation/controllers/auth/dtos/current-user.dto';
import { PermissionsRepository } from '@domain/repositories/auth/permissions.repository';
import { PermissionsMapper } from '@application/mappers/permissions.mapper';

@Injectable()
export class GetPermissionsByCompanyUseCase {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async execute(user: CurrentUserDto): Promise<PermissionsByCompanyResponseDto> {
    if (!user?.userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    if (!user.companyId) {
      throw new BadRequestException('No se ha establecido una compañía activa');
    }

    const [company, role] = await Promise.all([
      this.permissionsRepository.getCompanyWithBranding(user.companyId),
      this.permissionsRepository.getActiveRoleByUserId(user.userId),
    ]);

    if (!company) {
      throw new NotFoundException('Compañía no encontrada');
    }

    if (!role) {
      throw new NotFoundException('Rol activo no encontrado para el usuario');
    }

    const apps = await this.permissionsRepository.getApplicationsTreeWithRolePermissions(role.id);
    return PermissionsMapper.toPermissionsByCompanyResponse(company, role, apps);
  }
}
