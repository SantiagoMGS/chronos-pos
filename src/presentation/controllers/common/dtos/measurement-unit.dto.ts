import { ApiProperty } from '@nestjs/swagger';

export class MeasurementUnitDto {
  @ApiProperty({ example: '2f1a7b3c-9d4e-4a6b-8c21-1f2e3d4c5b6a' })
  id!: string;

  @ApiProperty({ example: 'unidad' })
  name!: string;

  @ApiProperty({ example: '94' })
  code!: string;
}
