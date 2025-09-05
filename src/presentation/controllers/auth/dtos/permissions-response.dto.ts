import { ApiProperty } from '@nestjs/swagger';

export class ActionNameResponseDto {
  @ApiProperty({
    description: 'Nombre de la acción',
    example: 'CREAR_PROVEEDOR',
  })
  name!: string;
}

export class SubresourceResponseDto {
  @ApiProperty({
    description: 'ID del subrecurso',
    example: '029d5411-4b62-48bd-bc0b-0e995c174a95',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del subrecurso',
    example: 'Crear Proveedor',
  })
  name!: string;

  @ApiProperty({
    description: 'Icono del subrecurso',
    example: 'supplier-plus',
  })
  icon!: string;

  @ApiProperty({
    description: 'Ruta del subrecurso',
    example: '/proveedores/crear',
  })
  path!: string;

  @ApiProperty({
    description: 'Acción permitida para el subrecurso',
    type: ActionNameResponseDto,
  })
  action!: ActionNameResponseDto;
}

export class ResourcePermissionResponseDto {
  @ApiProperty({
    description: 'ID del recurso',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del recurso',
    example: 'Proveedores',
  })
  name!: string;

  @ApiProperty({
    description: 'Icono del recurso',
    example: 'suppliers',
  })
  icon!: string;

  @ApiProperty({
    description: 'Ruta del recurso',
    example: '/proveedores',
  })
  path!: string;

  @ApiProperty({
    description: 'Subrecursos disponibles',
    type: [SubresourceResponseDto],
  })
  subresources!: SubresourceResponseDto[];

  @ApiProperty({
    description: 'Acciones disponibles cuando no hay subrecursos',
    type: [ActionNameResponseDto],
    required: false,
  })
  actions?: ActionNameResponseDto[];
}

export class ApplicationResponseDto {
  @ApiProperty({
    description: 'ID de la aplicación',
    example: '5dddcd73-ab48-427d-bdb3-98382a4ab119',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre de la aplicación',
    example: 'LIMS',
  })
  name!: string;

  @ApiProperty({
    description: 'Ruta de la aplicación',
    example: 'lims',
  })
  path!: string;

  @ApiProperty({
    description: 'Si la aplicación está activa',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Recursos de la aplicación',
    type: [ResourcePermissionResponseDto],
  })
  resources!: ResourcePermissionResponseDto[];
}

export class CompanyBrandingResponseDto {
  @ApiProperty({
    description: 'Logo de la compañía',
    example: 'https://example.com/logo.png',
    nullable: true,
  })
  logo?: string | null;

  @ApiProperty({
    description: 'Color primario de la marca',
    example: '#0066CC',
    nullable: true,
  })
  primaryColor?: string | null;

  @ApiProperty({
    description: 'Color secundario de la marca',
    example: '#FF9900',
    nullable: true,
  })
  secondaryColor?: string | null;

  @ApiProperty({
    description: 'Color terciario de la marca',
    example: '#333333',
    nullable: true,
  })
  tertiaryColor?: string | null;
}

export class CompanyInfoDto {
  @ApiProperty({
    description: 'ID de la compañía',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre de la compañía',
    example: 'Empresa Ejemplo S.A.',
  })
  name?: string;

  @ApiProperty({
    description: 'Nombre corto de la compañía',
    example: 'Ejemplo',
  })
  shortName?: string;

  @ApiProperty({
    description: 'Información de branding de la compañía',
    type: CompanyBrandingResponseDto,
    nullable: true,
  })
  branding!: CompanyBrandingResponseDto | null;
}

export class RoleResponseDto {
  @ApiProperty({
    description: 'ID del rol',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
  })
  name!: string;
}

export class PermissionsByCompanyResponseDto {
  @ApiProperty({
    description: 'Rol del usuario en la compañía',
    type: RoleResponseDto,
  })
  role!: RoleResponseDto;

  @ApiProperty({
    description: 'Aplicaciones disponibles para el usuario en la compañía',
    type: [ApplicationResponseDto],
  })
  applications!: ApplicationResponseDto[];
}
