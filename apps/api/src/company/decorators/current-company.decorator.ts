import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Company } from '@prisma/client';
import { RequestWithCompany } from '../types/request-with-company.type';

export const CurrentCompany = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Company => {
    const request = context.switchToHttp().getRequest<RequestWithCompany>();
    return request.company;
  },
);
