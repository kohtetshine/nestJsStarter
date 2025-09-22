import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ok, ApiResponse } from './index';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(
      map((data: any) => {
        if (data && typeof data === 'object' && 'success' in data) return data;
        const res = context.switchToHttp().getResponse();
        const statusCode = res?.statusCode ?? 200;
        return ok(data, statusCode);
      }),
    );
  }
}
