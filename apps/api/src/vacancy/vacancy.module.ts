import { Module } from '@nestjs/common';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';
import { VacancyRepository } from './vacancy.repository';
import { CompanyModule } from '../company/company.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { LanguageModule } from '../language/language.module';
import { SkillModule } from '../skill/skill.module';
import { VacancySearchService } from './vacancy-search.service';

@Module({
  imports: [
    CompanyModule,
    PrismaModule,
    AuthModule,
    LanguageModule,
    SkillModule,
  ],
  controllers: [VacancyController],
  providers: [VacancyService, VacancyRepository, VacancySearchService],
  exports: [VacancyService],
})
export class VacancyModule {}
