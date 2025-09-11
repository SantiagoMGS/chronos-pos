import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { ApiResponseDto, getResponseSchema } from '@shared/dtos/api-response.dto';
import { CustomResponse } from '@core/decorators/custom.response.decorator';
import { GetFactusTokenUseCase } from '@domain/use-cases/factus/get-factus-token.use-case';
import { FactusTokenResponseDto } from './dtos/factus-token-response.dto';
import { TestGetFactusUrlUseCase } from '@domain/use-cases/factus/test-get-factus-url.use-case';
import { ValidateFactusBillUseCase } from '@domain/use-cases/factus/validate-factus-bill.use-case';

@Controller('factus')
@ApiTags('Factus')
@ApiBearerAuth()
@ApiExtraModels(ApiResponseDto, FactusTokenResponseDto)
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
export class FactusController {
  constructor(
    private readonly getFactusTokenUseCase: GetFactusTokenUseCase,
    private readonly testGetFactusUrlUseCase: TestGetFactusUrlUseCase,
    private readonly validateFactusBillUseCase: ValidateFactusBillUseCase,
  ) {}

  @Get('token')
  @ApiOperation({ summary: 'Autenticación con Factus' })
  @ApiOkResponse({ description: 'Token obtenido correctamente', ...getResponseSchema(FactusTokenResponseDto) })
  @CustomResponse({ successMessage: 'Token de Factus obtenido correctamente' })
  async getToken(): Promise<FactusTokenResponseDto> {
    return await this.getFactusTokenUseCase.execute();
  }

  @Get('test')
  @ApiOperation({ summary: 'Probar GET a URL de Factus' })
  @ApiOkResponse({ description: 'Respuesta cruda de Factus', schema: { type: 'object' } })
  @CustomResponse({ successMessage: 'Solicitud GET a Factus ejecutada correctamente' })
  async testGet(@Query('url') url: string): Promise<any> {
    return await this.testGetFactusUrlUseCase.execute(url);
  }

  @Post('bills')
  @ApiOperation({ summary: 'Crear factura (En desarrollo)' })
  @ApiOkResponse({ description: 'Respuesta de Factus', schema: { type: 'object' } })
  @CustomResponse({ successMessage: 'Factura enviada a Factus correctamente' })
  async createBill(@Body() payload: any): Promise<any> {
    return await this.validateFactusBillUseCase.execute(payload);
  }
}
