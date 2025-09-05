import { ApiProperty } from '@nestjs/swagger';

export class CompanyBrandingDto {
  @ApiProperty({
    description: 'Logo de la compañía',
    example: 'https://example.com/logo.png',
    nullable: true,
  })
  logo!: string | null;

  @ApiProperty({
    description: 'Color primario de la marca',
    example: '#0066CC',
    nullable: true,
  })
  primaryColor!: string | null;

  @ApiProperty({
    description: 'Color secundario de la marca',
    example: '#FF9900',
    nullable: true,
  })
  secondaryColor!: string | null;

  @ApiProperty({
    description: 'Color terciario de la marca',
    example: '#333333',
    nullable: true,
  })
  tertiaryColor!: string | null;
}

export class CompanyResponseDto {
  @ApiProperty({
    description: 'ID único de la compañía',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre de la compañía',
    example: 'Empresa Ejemplo S.A.',
  })
  name!: string;

  @ApiProperty({
    description: 'Nombre corto de la compañía',
    example: 'EmpEjemplo',
  })
  shortName!: string;
}

export class TokensDto {
  @ApiProperty({})
  access_token!: string;

  @ApiProperty({})
  refresh_token!: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '12345678-1234-1234-1234-123456789012',
  })
  userId!: string;

  @ApiProperty({
    description: 'Tokens de autenticación',
    type: TokensDto,
  })
  tokens!: TokensDto;

  @ApiProperty({
    description: 'Compañías a las que tiene acceso el usuario',
    type: [CompanyResponseDto],
  })
  companies!: CompanyResponseDto[];
}
