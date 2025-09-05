import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@domain/entities/customer.entity';

export class CustomerResponseDto {
  @ApiProperty({ description: 'ID del cliente', example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
  name!: string;

  @ApiProperty({ description: 'Tipo de documento', enum: DocumentType, example: DocumentType.CEDULA_DE_CIUDADANIA })
  documentType!: DocumentType;

  @ApiProperty({ description: 'Número de documento', example: '1234567890' })
  documentNumber!: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'juan.perez@example.com' })
  email!: string;

  @ApiProperty({ description: 'Número de teléfono', example: '+57 300 123 4567' })
  phoneNumber!: string;

  @ApiProperty({ description: 'Estado activo', example: true })
  isActive!: boolean;
}
