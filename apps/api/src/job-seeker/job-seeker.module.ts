import { Module } from '@nestjs/common';
import { JobSeekerController } from './job-seeker.controller';
import { JobSeekerService } from './job-seeker.service';
import { JobSeekerGuard } from './guards/job-seeker.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SkillModule } from '../skill/skill.module';
import { LanguageModule } from '../language/language.module';
import { CreateJobSeekerGuard } from './guards/create-job-seeker.guard';
import { JobSeekerRepository } from './job-seeker.repository';
import { CompanyModule } from '../company/company.module';
import { JobSeekerSearchService } from './job-seeker-search.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    SkillModule,
    LanguageModule,
    CompanyModule,
  ],
  controllers: [JobSeekerController],
  providers: [
    JobSeekerService,
    JobSeekerGuard,
    CreateJobSeekerGuard,
    JobSeekerRepository,
    JobSeekerSearchService,
  ],
  exports: [JobSeekerService, JobSeekerGuard],
})
export class JobSeekerModule {}
