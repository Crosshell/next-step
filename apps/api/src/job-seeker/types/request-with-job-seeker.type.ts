import { Request } from 'express';
import { JobSeeker } from '@prisma/client';

export interface RequestWithJobSeeker extends Request {
  jobSeeker: JobSeeker;
}
