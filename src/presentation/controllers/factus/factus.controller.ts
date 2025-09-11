import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { ApiResponseDto, getResponseSchema } from '@shared/dtos/api-response.dto';
import { CustomResponse } from '@core/decorators/custom.response.decorator';
import { GetFactusTokenUseCase } from '@domain/use-cases/factus/get-factus-token.use-case';
import { FactusTokenResponseDto } from './dtos/factus-token-response.dto';

@Controller('factus')
@ApiTags('Factus')
@ApiBearerAuth()
@ApiExtraModels(ApiResponseDto, FactusTokenResponseDto)
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
export class FactusController {
  constructor(private readonly getFactusTokenUseCase: GetFactusTokenUseCase) {}

  @Get('token')
  @ApiOperation({ summary: 'Obtener token de Factus' })
  @ApiOkResponse({ description: 'Token obtenido correctamente', ...getResponseSchema(FactusTokenResponseDto) })
  @CustomResponse({ successMessage: 'Token de Factus obtenido correctamente' })
  async getToken(): Promise<FactusTokenResponseDto> {
    return await this.getFactusTokenUseCase.execute();
  }
}
