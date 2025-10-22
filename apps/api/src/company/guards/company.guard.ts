import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from '../../auth/types/request-with-user.type';
import { UserType } from '@prisma/client';
import { CompanyService } from '../company.service';
import { RequestWithCompany } from '../types/request-with-company.type';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private readonly service: CompanyService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<RequestWithUser & RequestWithCompany>();

    if (req.user.type !== UserType.COMPANY) {
      throw new ForbiddenException('User is not a company');
    }

    req.company = await this.service.findOneOrThrow({ userId: req.user.id });
    return true;
  }
}
