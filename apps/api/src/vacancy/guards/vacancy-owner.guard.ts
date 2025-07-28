import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestWithCompany } from '../../company/types/request-with-company.type';
import { VacancyService } from '../vacancy.service';

@Injectable()
export class VacancyOwnerGuard implements CanActivate {
  constructor(private readonly service: VacancyService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<RequestWithCompany>();
    const vacancyId = req.params['id'];

    if (!vacancyId) {
      throw new ForbiddenException('Vacancy id not found');
    }

    const vacancy = await this.service.findOne({ id: vacancyId });

    if (!vacancy) {
      throw new ForbiddenException('Vacancy not found');
    }

    if (vacancy.companyId !== req.company.id) {
      throw new ForbiddenException('You are not the owner of this vacancy');
    }

    return true;
  }
}
