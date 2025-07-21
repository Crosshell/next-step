import { Request } from 'express';
import { Company } from '@prisma/client';

export interface RequestWithCompany extends Request {
  company: Company;
}
