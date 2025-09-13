import { IsNotEmpty, IsString, IsOptional, IsEnum, MaxLength, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ItemType } from '@domain/entities/item.entity';

export class CreateItemDto {
  @ApiProperty({
    description: 'Nombre del item',
    example: 'Laptop Dell Inspiron 15',
    required: true,
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  name!: string;

  @ApiProperty({
    description: 'Código único del item',
    example: 'LAP-DELL-001',
    required: true,
  })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El código no puede exceder 50 caracteres' })
  code!: string;

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
    example: 2500000,
    required: true,
    type: Number,
  })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  price!: number;

  @ApiProperty({
    description: 'ID de la unidad de medida asociada',
    example: '2f1a7b3c-9d4e-4a6b-8c21-1f2e3d4c5b6a',
    required: true,
  })
  @IsNotEmpty({ message: 'measurementUnitId es obligatorio' })
  @IsUUID('4', { message: 'measurementUnitId debe ser un UUID válido' })
  measurementUnitId!: string;

  @ApiProperty({
    description: 'Tipo de item',
    enum: ItemType,
    example: ItemType.PRODUCTO,
    required: true,
  })
  @IsNotEmpty({ message: 'El tipo de item es obligatorio' })
  @IsEnum(ItemType, { message: 'El tipo de item debe ser PRODUCTO o SERVICIO' })
  itemType!: ItemType;
}
