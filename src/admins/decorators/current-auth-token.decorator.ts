import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentAuthToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.current_auth_token as string;
  },
);
