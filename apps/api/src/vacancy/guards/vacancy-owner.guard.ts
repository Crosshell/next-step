import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { VacancyService } from '../services/vacancy.service';
import { RecruiterRequest } from '../../recruiter/types/recruiter-request.type';

@Injectable()
export class VacancyOwnerGuard implements CanActivate {
  constructor(private readonly service: VacancyService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<RecruiterRequest>();
    const rawId = req.params['id'] ?? req.params['vacancyId'];

    if (!rawId) {
      throw new ForbiddenException('Vacancy id not found in request url');
    }

    const vacancyId = Array.isArray(rawId) ? rawId[0] : rawId;

    const vacancy = await this.service.findOneOrThrow({ id: vacancyId });

    if (vacancy.companyId !== req.recruiter.companyId) {
      throw new ForbiddenException('You are not the owner of this vacancy');
    }

    return true;
  }
}
