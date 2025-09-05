import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '../../../core/interceptores/response.interceptor';
import { ApiResponseDto, getArrayResponseSchema } from 'src/shared/dtos/api-response.dto';
import { DocumentType } from '@prisma-tenant-base/tenant-database-client-types';
import { CustomResponse } from '../../../core/decorators/custom.response.decorator';
import { DocumentTypeOptionDto } from './dtos/document-type-option.dto';

@Controller('common')
@ApiTags('Comunes')
@ApiBearerAuth()
@ApiExtraModels(ApiResponseDto)
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
export class CommonController {
  @Get('document-types')
  @ApiOperation({ summary: 'Obtener tipos de documento' })
  @ApiOkResponse({
    description: 'Lista de tipos de documento obtenida correctamente',
    ...getArrayResponseSchema(DocumentTypeOptionDto),
  })
  @CustomResponse({ successMessage: 'Tipos de documento obtenidos correctamente' })
  getDocumentTypes() {
    const codeMap: Record<string, string> = {
      CEDULA_DE_CIUDADANIA: 'CC',
      TARJETA_DE_IDENTIDAD: 'TI',
      CEDULA_DE_EXTRANJERIA: 'CE',
      NIT: 'NIT',
    };

    return Object.values(DocumentType).map((value) => ({
      value,
      code: codeMap[value] ?? value,
      label: value.replace(/_/g, ' '),
    }));
  }
}
