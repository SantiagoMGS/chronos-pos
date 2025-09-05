import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { DocumentType } from '@domain/entities/customer.entity';

export class UpdateCustomerDto {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez', required: false })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  name?: string;

  @ApiProperty({ description: 'Tipo de documento', enum: DocumentType, required: false })
  @IsOptional()
  @IsEnum(DocumentType, { message: 'Tipo de documento inválido' })
  documentType?: DocumentType;

  @ApiProperty({ description: 'Número de documento', example: '1234567890', required: false })
  @IsOptional()
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El número de documento no puede exceder 50 caracteres' })
  documentNumber?: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'juan.perez@example.com', required: false })
  @IsOptional()
  @IsString({ message: 'El email debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El email no puede exceder 255 caracteres' })
  email?: string;

  @ApiProperty({ description: 'Número de teléfono', example: '+57 300 123 4567', required: false })
  @IsOptional()
  @IsString({ message: 'El número de teléfono debe ser una cadena de texto' })
  @MaxLength(30, { message: 'El número de teléfono no puede exceder 30 caracteres' })
  phoneNumber?: string;

  @ApiProperty({ description: 'Estado activo', example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  isActive?: boolean;
}
