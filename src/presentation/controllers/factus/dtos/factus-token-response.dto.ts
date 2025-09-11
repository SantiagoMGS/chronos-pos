import { ApiProperty } from '@nestjs/swagger';

export class FactusTokenResponseDto {
  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ example: 3600 })
  expiresIn: number;

  @ApiProperty({ example: 'eyJhbGciOi...' })
  accessToken: string;

  @ApiProperty({ example: 'def50200...' })
  refreshToken: string;
}
