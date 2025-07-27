import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithCompany } from '../../company/types/request-with-company.type';
import { VacancyService } from '../vacancy.service';

@Injectable()
export class VacancyOwnerGuard implements CanActivate {
  constructor(private readonly service: VacancyService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<RequestWithCompany>();
    const vacancyId = req.params['id'];

    if (!vacancyId) {
      return false;
    }

    const vacancy = await this.service.findOneOrThrow({ id: vacancyId });

    return vacancy.companyId === req.company.id;
  }
}
