import { Module } from '@nestjs/common';
import { JobSeekerController } from './job-seeker.controller';
import { JobSeekerService } from './job-seeker.service';
import { JobSeekerGuard } from './guards/job-seeker.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CompanyGuard } from '../company/guards/company.guard';
import { SkillModule } from '../skill/skill.module';
import { LanguageModule } from '../language/language.module';
import { CreateJobSeekerGuard } from './guards/create-job-seeker.guard';
import { JobSeekerRepository } from './job-seeker.repository';

@Module({
  imports: [AuthModule, PrismaModule, SkillModule, LanguageModule],
  controllers: [JobSeekerController],
  providers: [
    JobSeekerService,
    JobSeekerGuard,
    CompanyGuard,
    CreateJobSeekerGuard,
    JobSeekerRepository,
  ],
})
export class JobSeekerModule {}
