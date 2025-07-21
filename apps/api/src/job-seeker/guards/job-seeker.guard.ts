import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUser } from '../../auth/types/request-with-user.type';
import { UserType } from '@prisma/client';
import { JobSeekerService } from '../services/job-seeker.service';

@Injectable()
export class JobSeekerGuard implements CanActivate {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();

    if (req.user.type !== UserType.JOB_SEEKER) {
      return false;
    }

    await this.jobSeekerService.findOrThrow({ userId: req.user.id });

    return true;
  }
}
