import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExtraModels,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { LoginDto } from './dtos/login.dto';
import { SetCompanyDto, SetCompanyResponseDto } from './dtos/set-company.dto';
import { CurrentUserDto } from './dtos/current-user.dto';
import { PermissionsByCompanyResponseDto } from './dtos/permissions-response.dto';
import { getResponseSchema, ApiResponseDto } from 'src/shared/dtos/api-response.dto';
import { CustomResponse } from 'src/core/decorators/custom.response.decorator';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LoginUseCase } from '@domain/use-cases/auth/login.use-case';
import { SetCompanyUseCase } from '../../../domain/use-cases/auth/set-company.use-case';
import { GetPermissionsByCompanyUseCase } from '../../../domain/use-cases/auth/get-permissions-by-company.use-case';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '../../../core/interceptores/response.interceptor';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';

@Controller('auth')
@ApiTags('Autenticación')
@ApiBearerAuth()
@ApiExtraModels(ApiResponseDto, LoginResponseDto, SetCompanyResponseDto, PermissionsByCompanyResponseDto)
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly setCompanyUseCase: SetCompanyUseCase,
    private readonly getPermissionsByCompanyUseCase: GetPermissionsByCompanyUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales del usuario para autenticación.',
  })
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiOkResponse({
    description: 'Usuario autenticado correctamente',
    ...getResponseSchema(LoginResponseDto),
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales incorrectas',
  })
  @CustomResponse({
    successMessage: 'Usuario autenticado correctamente',
  })
  async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<LoginResponseDto> {
    return await this.loginUseCase.execute(loginDto, req);
  }

  @Post('set-company')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Establecer compañía activa para el usuario' })
  @ApiBearerAuth()
  @ApiBody({
    type: SetCompanyDto,
    description: 'Datos para establecer la compañía del usuario',
  })
  @ApiOkResponse({
    description: 'Compañía establecida correctamente',
    ...getResponseSchema(SetCompanyResponseDto),
  })
  @CustomResponse({
    successMessage: 'Compañía establecida correctamente',
  })
  async setCompany(@Body() setCompanyDto: SetCompanyDto, @Req() req: Request): Promise<SetCompanyResponseDto> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    const tokens = await this.setCompanyUseCase.execute({ userId, companyId: setCompanyDto.companyId });
    return tokens;
  }

  @Get('permissions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener permisos del usuario para una compañía específica',
  })
  @ApiResponse({
    status: 200,
    description: 'Permisos del usuario para la compañía',
    ...getResponseSchema(PermissionsByCompanyResponseDto),
  })
  @ApiResponse({ status: 400, description: 'ID de compañía inválido' })
  @ApiResponse({ status: 403, description: 'No tiene acceso a esta compañía' })
  @ApiResponse({ status: 404, description: 'Compañía no encontrada' })
  @CustomResponse({
    successMessage: 'Permisos obtenidos correctamente',
  })
  async getPermissionsByCompany(@CurrentUser() user: CurrentUserDto): Promise<PermissionsByCompanyResponseDto> {
    return await this.getPermissionsByCompanyUseCase.execute(user.userId);
  }
}
