import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from '../../auth/types/request-with-user.type';
import { UserType } from '@prisma/client';

@Injectable()
export class CreateJobSeekerGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();

    if (req.user.type !== UserType.JOB_SEEKER) {
      throw new ForbiddenException('User is not a job seeker');
    }

    return true;
  }
}
