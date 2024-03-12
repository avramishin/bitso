import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { isArray } from 'lodash';
import { uuidv4 } from './common/uuid-v4';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = exception.message;

    if ((exception as HttpException).getStatus) {
      status = (exception as HttpException).getStatus();
      message = ((exception as HttpException).getResponse() as any).message;
    }

    const traceId = uuidv4().slice(0, 8);
    const stack = exception.stack
      ? exception.stack
          .split('\n')
          .slice(0, 3)
          .map((row) => row.trim())
      : 'no stack';

    const admin = (request['admin'] || {}) as any;
    const logData = {
      message,
      request: {
        url: `${request.method} ${request.url}`,
        body: request.body,
        query: request.query,
      },
      admin,
      stack,
      traceId,
    };

    console.error(JSON.stringify(logData, null, 2));
    response.status(status).json({
      statusCode: status,
      message: isArray(message) && message.length ? message[0] : message,
      validation: isArray(message) ? message : undefined,
      path: request.url,
      traceId,
    });
  }
}
