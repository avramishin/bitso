import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { BasicAuthException } from '../exceptions/basic-auth.exception';

@Catch(BasicAuthException)
export class BasicAuthExceptionFilter implements ExceptionFilter {
  catch(exception: BasicAuthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.set('WWW-Authenticate', 'Basic realm="Authentication required."');
    response.status(401).send();
  }
}
