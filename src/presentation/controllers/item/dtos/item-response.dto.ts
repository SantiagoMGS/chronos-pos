import { ApiProperty } from '@nestjs/swagger';
import { ItemType } from '@domain/entities/item.entity';

export class ItemResponseDto {
  @ApiProperty({
    description: 'ID único del item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del item',
    example: 'Laptop Dell Inspiron 15',
  })
  name!: string;

  @ApiProperty({
    description: 'Código único del item',
    example: 'LAP-DELL-001',
  })
  code!: string;

  @ApiProperty({
    description: 'Descripción del item',
    example: 'Laptop Dell Inspiron 15 con procesador Intel i5',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'Precio del item',
    example: 1499.99,
  })
  price!: number;

  @ApiProperty({
    description: 'ID de la unidad de medida asociada',
    example: '2f1a7b3c-9d4e-4a6b-8c21-1f2e3d4c5b6a',
    nullable: true,
    required: false,
  })
  measurementUnitId!: string;

  @ApiProperty({
    description: 'Estado activo del item',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Tipo de item',
    enum: ItemType,
    example: ItemType.PRODUCTO,
  })
  itemType!: ItemType;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  updatedAt?: Date;
}
