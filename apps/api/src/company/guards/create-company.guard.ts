import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from '../../auth/types/request-with-user.type';
import { UserType } from '@prisma/client';

@Injectable()
export class CreateCompanyGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();

    if (req.user.type !== UserType.COMPANY) {
      throw new ForbiddenException('User is not a company');
    }

    return true;
  }
}
