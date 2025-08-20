import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CUSTOM_RESPONSE_METADATA, CustomResponseOptions } from '../decorators/custom.response.decorator';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const customOptions = this.reflector.get<CustomResponseOptions>(CUSTOM_RESPONSE_METADATA, context.getHandler());

    const successMessage = customOptions?.successMessage || 'Operación exitosa';

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return {
            ...data,
            message: data.message || successMessage,
          };
        }

        return {
          success: true,
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: successMessage,
          data: data,
        };
      }),
    );
  }
}
