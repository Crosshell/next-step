import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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
      throw new ForbiddenException('User is not a job seeker');
    }

    const jobSeeker = await this.service.findOne({ userId: req.user.id });

    if (!jobSeeker) {
      throw new ForbiddenException('Job seeker profile not found');
    }

    req.jobSeeker = jobSeeker;
    return true;
  }
}
