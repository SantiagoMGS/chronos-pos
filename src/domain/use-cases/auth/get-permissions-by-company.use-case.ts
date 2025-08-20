import { Injectable } from '@nestjs/common';
import { PermissionsByCompanyResponseDto } from '@presentation/controllers/auth/dtos/permissions-response.dto';

@Injectable()
export class GetPermissionsByCompanyUseCase {
  async execute(userId: string): Promise<PermissionsByCompanyResponseDto> {
    return {
      company: {
        id: '12345678-1234-1234-1234-123456789012',
        name: 'Empresa Demo',
        shortName: 'Demo',
        branding: {
          logo: null,
          primaryColor: '#0066CC',
          secondaryColor: '#FF9900',
          tertiaryColor: '#333333',
        },
      },
      role: {
        id: '87654321-4321-4321-4321-210987654321',
        name: 'Administrador',
      },
      applications: [
        {
          id: '5dddcd73-ab48-427d-bdb3-98382a4ab119',
          name: 'Sistema POS',
          path: 'pos',
          isActive: true,
          resources: [
            {
              id: 'resource-1',
              name: 'Proveedores',
              icon: 'suppliers',
              path: '/proveedores',
              subresources: [],
              actions: [
                { name: 'LISTAR_PROVEEDORES' },
                { name: 'CREAR_PROVEEDOR' },
                { name: 'EDITAR_PROVEEDOR' },
                { name: 'ELIMINAR_PROVEEDOR' },
              ],
            },
          ],
        },
      ],
    };
  }
}
