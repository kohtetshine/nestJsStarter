import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse() as
        | string
        | { message?: string | string[]; [key: string]: any };

      const message =
        typeof response === 'string'
          ? response
          : Array.isArray(response?.message)
          ? response.message.join(', ')
          : response?.message || exception.message;

      return res.status(status).json({ success: false, statusCode: status, error: message });
    }

    // Fallback for unexpected errors (do not leak internals)
    // eslint-disable-next-line no-console
    console.error(exception);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Something went wrong' });
  }
}
