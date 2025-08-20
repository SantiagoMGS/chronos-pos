import { Controller, Post, HttpCode, HttpStatus, Body, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExtraModels,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { LoginDto } from './dtos/login.dto';
import { SetCompanyDto, SetCompanyResponseDto } from './dtos/set-company.dto';
import { getResponseSchema, ApiResponseDto } from 'src/shared/dtos/api-response.dto';
import { CustomResponse } from 'src/core/decorators/custom.response.decorator';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LoginUseCase } from '@domain/use-cases/auth/login.use-case';
import { SetCompanyUseCase } from '../../../domain/use-cases/auth/set-company.use-case';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { ResponseInterceptor } from '../../../core/interceptores/response.interceptor';

@Controller('auth')
@ApiTags('Autenticación')
@ApiBearerAuth()
@ApiExtraModels(ApiResponseDto, LoginResponseDto, SetCompanyResponseDto)
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly setCompanyUseCase: SetCompanyUseCase,
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
    return this.setCompanyUseCase.execute(setCompanyDto.companyId, req);
  }
}
