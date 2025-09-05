import { ApiProperty } from '@nestjs/swagger';

export class DocumentTypeOptionDto {
  @ApiProperty({ example: 'CEDULA_DE_CIUDADANIA', description: 'Valor del enum para enviar al backend' })
  value!: string;

  @ApiProperty({ example: 'CC' })
  code!: string;

  @ApiProperty({ example: 'CEDULA DE CIUDADANIA' })
  label!: string;
}
