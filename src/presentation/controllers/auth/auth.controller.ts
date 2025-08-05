import { Controller, Post, HttpCode, HttpStatus, Body, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExtraModels,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { getResponseSchema } from 'src/shared/dtos/api-response.dto';
import { CustomResponse } from 'src/core/decorators/custom.response.decorator';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LoginUseCase } from '@domain/use-cases/auth/login.use-case';

@Controller('auth')
@ApiTags('Autenticación')
@ApiBearerAuth()
@ApiExtraModels()
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

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
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.loginUseCase.execute(loginDto);
  }
}
