import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '../../../core/interceptores/response.interceptor';
import { ApiResponseDto, getArrayResponseSchema } from 'src/shared/dtos/api-response.dto';
import { DocumentType } from '@prisma-tenant-base/tenant-database-client-types';
import { CustomResponse } from '../../../core/decorators/custom.response.decorator';
import { DocumentTypeOptionDto } from './dtos/document-type-option.dto';
import { GetAllDepartmentsUseCase } from '@domain/use-cases/common/get-all-departments.use-case';
import { GetCitiesUseCase } from '@domain/use-cases/common/get-cities.use-case';
import { DepartmentOptionDto } from './dtos/department-option.dto';
import { CityOptionDto } from './dtos/city-option.dto';

@Controller('common')
@ApiTags('Comunes')
@ApiBearerAuth()
@ApiExtraModels(ApiResponseDto)
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
export class CommonController {
  constructor(
    private readonly getAllDepartmentsUseCase: GetAllDepartmentsUseCase,
    private readonly getCitiesUseCase: GetCitiesUseCase,
  ) {}

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

  @Get('departments')
  @ApiOperation({ summary: 'Obtener departamentos (Dropdown)' })
  @ApiOkResponse({ description: 'Lista de departamentos', ...getArrayResponseSchema(DepartmentOptionDto) })
  @CustomResponse({ successMessage: 'Departamentos obtenidos correctamente' })
  async getDepartments(): Promise<DepartmentOptionDto[]> {
    const departments = await this.getAllDepartmentsUseCase.execute();
    return departments.map((d) => ({ value: d.id, label: d.name }));
  }

  @Get('cities')
  @ApiOperation({ summary: 'Obtener ciudades (Dropdown)' })
  @ApiQuery({ name: 'departmentId', required: false, description: 'ID del departamento para filtrar' })
  @ApiOkResponse({ description: 'Lista de ciudades', ...getArrayResponseSchema(CityOptionDto) })
  @CustomResponse({ successMessage: 'Ciudades obtenidas correctamente' })
  async getCities(@Query('departmentId') departmentId?: string): Promise<CityOptionDto[]> {
    const cities = await this.getCitiesUseCase.execute(departmentId);
    return cities.map((c) => ({ value: c.id, label: c.name }));
  }
}
