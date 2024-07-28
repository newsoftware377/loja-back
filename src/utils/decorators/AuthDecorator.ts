import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserViewModel } from 'src/api/viewModels/UserViewModel';
import { JWTService } from 'src/business/services/JWTService';
import { Roles } from '../enums/Roles';

@Injectable()
class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JWTService,
    private readonly reflector: Reflector
  ) { }

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const request = ctx.switchToHttp().getRequest();
    const response = ctx.switchToHttp().getResponse();
    const [, token] = (request.headers?.authorization || '').split(' ');

    let user: UserViewModel;
    try {
      user = await this.jwtService.decodeToken(token) as UserViewModel;
    } catch {
      response.status(401).send({ message: 'Token invalido' });
    }

    const roles = this.reflector.get<Roles[]>('required-role', ctx.getHandler())

    if (!roles?.includes(user?.cargo)) {
      response.status(401).send({ message: 'Voce nao tem acesso para esse recurso' });
    }

    return next.handle();
  }
}

export function AuthRequired(role: Roles[]) {
  return applyDecorators(
    SetMetadata('required-role', role),
    UseInterceptors(AuthInterceptor)
  );
}
