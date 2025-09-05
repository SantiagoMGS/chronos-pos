import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExtraModels,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerResponseDto } from './dtos/customer-response.dto';
import { QueryCustomersDto } from './dtos/query-customers.dto';
import {
  getResponseSchema,
  getArrayResponseSchema,
  ApiResponseDto,
  getPaginatedResponseSchema,
} from 'src/shared/dtos/api-response.dto';
import { CustomResponse } from 'src/core/decorators/custom.response.decorator';
import { CreateCustomerUseCase } from '@domain/use-cases/customer/create-customer.use-case';
import { GetCustomerUseCase } from '@domain/use-cases/customer/get-customer.use-case';
import { GetAllCustomersUseCase } from '@domain/use-cases/customer/get-all-customers.use-case';
import { UpdateCustomerUseCase } from '@domain/use-cases/customer/update-customer.use-case';
import { DeleteCustomerUseCase } from '@domain/use-cases/customer/delete-customer.use-case';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';

@Controller('customers')
@ApiTags('Clientes')
@ApiBearerAuth()
@ApiExtraModels(ApiResponseDto, CustomerResponseDto)
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiBody({ type: CreateCustomerDto, description: 'Datos del cliente a crear' })
  @ApiOkResponse({ description: 'Cliente creado correctamente', ...getResponseSchema(CustomerResponseDto) })
  @CustomResponse({ successMessage: 'Cliente creado correctamente' })
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return await this.createCustomerUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes (paginado)' })
  @ApiOkResponse({
    description: 'Lista de clientes obtenida correctamente',
    ...getPaginatedResponseSchema(CustomerResponseDto),
  })
  @CustomResponse({ successMessage: 'Clientes obtenidos correctamente' })
  async findAll(@Query() query: QueryCustomersDto) {
    const { page = 1, limit = 10, withDeleted } = query;
    return await this.getAllCustomersUseCase.execute({ page, limit, withDeleted });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID único del cliente', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOkResponse({ description: 'Cliente encontrado', ...getResponseSchema(CustomerResponseDto) })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado' })
  @CustomResponse({ successMessage: 'Cliente obtenido correctamente' })
  async findOne(@Param('id') id: string): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerUseCase.execute(id);
    if (!customer) throw new NotFoundException('Cliente no encontrado');
    return customer;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiParam({ name: 'id', description: 'ID único del cliente', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateCustomerDto, description: 'Datos del cliente a actualizar' })
  @ApiOkResponse({ description: 'Cliente actualizado correctamente', ...getResponseSchema(CustomerResponseDto) })
  @CustomResponse({ successMessage: 'Cliente actualizado correctamente' })
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    return await this.updateCustomerUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un cliente (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID único del cliente', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOkResponse({ description: 'Cliente eliminado correctamente', ...getResponseSchema(CustomerResponseDto) })
  @CustomResponse({ successMessage: 'Cliente eliminado correctamente' })
  async remove(@Param('id') id: string): Promise<CustomerResponseDto> {
    return await this.deleteCustomerUseCase.execute(id);
  }
}
