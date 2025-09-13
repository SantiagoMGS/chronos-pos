import { ApiProperty } from '@nestjs/swagger';

export class MeasurementUnitBaseDto {
  @ApiProperty({ example: '2f1a7b3c-9d4e-4a6b-8c21-1f2e3d4c5b6a' })
  id!: string;

  @ApiProperty({ example: 'unidad' })
  name!: string;
}

export class MeasurementUnitDto extends MeasurementUnitBaseDto {
  @ApiProperty({ example: '94' })
  code!: string;
}

export class MeasurementUnitBasicDto extends MeasurementUnitBaseDto {}
