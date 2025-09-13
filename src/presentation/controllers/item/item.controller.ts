import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
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
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { ItemResponseDto } from './dtos/item-response.dto';
import { QueryItemsDto } from './dtos/query-items.dto';
import {
  getResponseSchema,
  getArrayResponseSchema,
  ApiResponseDto,
  getPaginatedResponseSchema,
} from 'src/shared/dtos/api-response.dto';
import { CustomResponse } from 'src/core/decorators/custom.response.decorator';
import { CreateItemUseCase } from '@domain/use-cases/item/create-item.use-case';
import { GetItemUseCase } from '@domain/use-cases/item/get-item.use-case';
import { GetAllItemsUseCase } from '@domain/use-cases/item/get-all-items.use-case';
import { UpdateItemUseCase } from '@domain/use-cases/item/update-item.use-case';
import { DeleteItemUseCase } from '@domain/use-cases/item/delete-item.use-case';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '../../../core/interceptores/response.interceptor';

@Controller('items')
@ApiTags('Items')
@ApiBearerAuth()
@ApiExtraModels(ApiResponseDto, ItemResponseDto)
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(
    private readonly createItemUseCase: CreateItemUseCase,
    private readonly getItemUseCase: GetItemUseCase,
    private readonly getAllItemsUseCase: GetAllItemsUseCase,
    private readonly updateItemUseCase: UpdateItemUseCase,
    private readonly deleteItemUseCase: DeleteItemUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo item' })
  @ApiBody({
    type: CreateItemDto,
    description: 'Datos del item a crear',
  })
  @ApiOkResponse({
    description: 'Item creado correctamente',
    ...getResponseSchema(ItemResponseDto),
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o código duplicado',
  })
  @CustomResponse({
    successMessage: 'Item creado correctamente',
  })
  async create(@Body() createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    return await this.createItemUseCase.execute(createItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los items (paginado)' })
  @ApiOkResponse({
    description: 'Lista de items obtenida correctamente',
    ...getPaginatedResponseSchema(ItemResponseDto),
  })
  @CustomResponse({
    successMessage: 'Items obtenidos correctamente',
  })
  async findAll(@Query() query: QueryItemsDto) {
    const { page = 1, limit = 10, withDeleted } = query;
    const result = await this.getAllItemsUseCase.execute({ page, limit, withDeleted });
    return {
      ...result,
      items: result.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        description: item.description,
        price: item.price,
        isActive: item.isActive,
        itemType: item.itemType,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        measurementUnit: item.measurementUnit,
      })),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un item por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único del item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Item encontrado',
    ...getResponseSchema(ItemResponseDto),
  })
  @ApiNotFoundResponse({
    description: 'Item no encontrado',
  })
  @CustomResponse({
    successMessage: 'Item obtenido correctamente',
  })
  async findOne(@Param('id') id: string): Promise<ItemResponseDto> {
    const item: any = await this.getItemUseCase.execute(id);
    if (!item) {
      throw new NotFoundException('Item no encontrado');
    }
    return {
      id: item.id,
      name: item.name,
      code: item.code,
      description: item.description,
      price: item.price,
      isActive: item.isActive,
      itemType: item.itemType,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      measurementUnit: item.measurementUnit
        ? { id: item.measurementUnit.id, name: item.measurementUnit.name }
        : undefined,
    } as unknown as ItemResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un item' })
  @ApiParam({
    name: 'id',
    description: 'ID único del item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateItemDto,
    description: 'Datos del item a actualizar',
  })
  @ApiOkResponse({
    description: 'Item actualizado correctamente',
    ...getResponseSchema(ItemResponseDto),
  })
  @ApiNotFoundResponse({
    description: 'Item no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o código duplicado',
  })
  @CustomResponse({
    successMessage: 'Item actualizado correctamente',
  })
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto): Promise<ItemResponseDto> {
    try {
      return await this.updateItemUseCase.execute(id, updateItemDto);
    } catch (error) {
      if (error.message === 'Item no encontrado') {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un item (soft delete)' })
  @ApiParam({
    name: 'id',
    description: 'ID único del item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Item eliminado correctamente',
    ...getResponseSchema(ItemResponseDto),
  })
  @ApiNotFoundResponse({
    description: 'Item no encontrado',
  })
  @CustomResponse({
    successMessage: 'Item eliminado correctamente',
  })
  async remove(@Param('id') id: string): Promise<ItemResponseDto> {
    const result = await this.deleteItemUseCase.execute(id);
    return result as ItemResponseDto;
  }
}
