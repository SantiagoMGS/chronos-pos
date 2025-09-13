import { IsOptional, IsString, IsBoolean, IsEnum, MaxLength, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ItemType } from '@domain/entities/item.entity';

export class UpdateItemDto {
  @ApiProperty({
    description: 'Nombre del item',
    example: 'Laptop Dell Inspiron 15',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Código único del item',
    example: 'LAP-DELL-001',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El código no puede exceder 50 caracteres' })
  code?: string;

  @ApiProperty({
    description: 'Descripción del item',
    example: 'Laptop Dell Inspiron 15 con procesador Intel i5',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'Precio del item',
    example: 2700000,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número' })
  price?: number;

  @ApiProperty({
    description: 'ID de la unidad de medida asociada',
    example: '2f1a7b3c-9d4e-4a6b-8c21-1f2e3d4c5b6a',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'measurementUnitId debe ser un UUID válido' })
  measurementUnitId?: string;

  @ApiProperty({
    description: 'Estado activo del item',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  isActive?: boolean;

  @ApiProperty({
    description: 'Tipo de item',
    enum: ItemType,
    example: ItemType.PRODUCTO,
    required: false,
  })
  @IsOptional()
  @IsEnum(ItemType, { message: 'El tipo de item debe ser PRODUCTO o SERVICIO' })
  itemType?: ItemType;
}
