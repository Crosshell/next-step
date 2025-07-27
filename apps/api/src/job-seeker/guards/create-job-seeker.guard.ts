import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUser } from '../../auth/types/request-with-user.type';
import { UserType } from '@prisma/client';

@Injectable()
export class CreateJobSeekerGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return req.user.type === UserType.JOB_SEEKER;
  }
}
