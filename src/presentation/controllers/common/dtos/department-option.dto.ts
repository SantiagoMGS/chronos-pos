import { ApiProperty } from '@nestjs/swagger';

export class DepartmentOptionDto {
  @ApiProperty({ example: 'a6b73b2e-0db7-4a18-9a9b-3c2d5f4e6a7b' })
  value!: string;

  @ApiProperty({ example: 'ANTIOQUIA' })
  label!: string;
}
