import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { RequestWithUser } from '../types/request-with-user.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowed = this.reflector.get<UserType[]>(
      'roles',
      context.getHandler(),
    );
    if (!allowed?.length) return true;
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    return allowed.includes(req.user.type);
  }
}
