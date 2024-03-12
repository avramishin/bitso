import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Admin } from '../models/admin.model';

export const CurrentAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.current_admin as Admin;
  },
);
