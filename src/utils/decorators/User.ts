import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const auth = request.headers.authorization || ''
    const [, token] = auth.split(' ')

    const dataBase64 = token?.split('.')?.[1] || ''
    const data = atob(dataBase64)
   
    return data ? JSON.parse(data || '') : null
  },
);
