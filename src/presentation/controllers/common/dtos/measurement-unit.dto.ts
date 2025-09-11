import { ApiProperty } from '@nestjs/swagger';

export class MeasurementUnitDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000070' })
  id!: string;

  @ApiProperty({ example: 'unidad' })
  name!: string;

  @ApiProperty({ example: '94' })
  code!: string;
}
