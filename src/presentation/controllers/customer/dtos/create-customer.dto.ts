import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { DocumentType } from '@domain/entities/customer.entity';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  name!: string;

  @ApiProperty({ description: 'Tipo de documento', enum: DocumentType, example: DocumentType.CEDULA_DE_CIUDADANIA })
  @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
  @IsEnum(DocumentType, { message: 'Tipo de documento inválido' })
  documentType!: DocumentType;

  @ApiProperty({ description: 'Número de documento', example: '1234567890' })
  @IsNotEmpty({ message: 'El número de documento es obligatorio' })
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El número de documento no puede exceder 50 caracteres' })
  documentNumber!: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'juan.perez@example.com' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsString({ message: 'El email debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El email no puede exceder 255 caracteres' })
  email!: string;

  @ApiProperty({ description: 'Número de teléfono', example: '+57 300 123 4567' })
  @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
  @IsString({ message: 'El número de teléfono debe ser una cadena de texto' })
  @MaxLength(30, { message: 'El número de teléfono no puede exceder 30 caracteres' })
  phoneNumber!: string;
}
