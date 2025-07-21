import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { JobSeekerService } from '../job-seeker.service';
import { RequestWithJobSeeker } from '../types/request-with-job-seeker.type';
import { RequestWithUser } from '../../auth/types/request-with-user.type';

@Injectable()
export class JobSeekerGuard implements CanActivate {
  constructor(private readonly service: JobSeekerService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<RequestWithUser & RequestWithJobSeeker>();

    if (req.user.type !== UserType.JOB_SEEKER) {
      return false;
    }

    req.jobSeeker = await this.service.findOneOrThrow({ userId: req.user.id });

    return true;
  }
}
