import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from '@core/config/envs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ChronoPOS API')
    .setDescription('Documentación de la API de ChronoPOS')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  app.use(
    '/api/docs',
    apiReference({
      title: 'Docs ChronoPOS API',
      content: document,
      theme: 'purple',
      layout: 'modern',
      darkMode: true,
    }),
  );

  const port = envs.port;
  await app.listen(port);

  logger.log(`🚀 Aplicación iniciada en http://localhost:${port}/api`);
  logger.log(`📚 Documentación API (Scalar) disponible en http://localhost:${port}/api/docs`);
}
bootstrap();
