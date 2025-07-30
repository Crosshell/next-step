import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithJobSeeker } from '../types/request-with-job-seeker.type';
import { JobSeeker } from '@prisma/client';

export const CurrentJobSeeker = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JobSeeker => {
    const request = context.switchToHttp().getRequest<RequestWithJobSeeker>();
    return request.jobSeeker;
  },
);
