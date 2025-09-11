import { ApiProperty } from '@nestjs/swagger';

export class CityOptionDto {
  @ApiProperty({ example: 'b7c84c3f-1ec8-4b29-8b0c-4d3e6f7a8b9c' })
  value!: string;

  @ApiProperty({ example: 'MEDELLIN' })
  label!: string;
}
