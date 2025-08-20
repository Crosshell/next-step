import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { ApplicationRepository } from './application.repository';
import { AuthModule } from '../auth/auth.module';
import { JobSeekerModule } from '../job-seeker/job-seeker.module';
import { PrismaModule } from '../prisma/prisma.module';
import { VacancyModule } from '../vacancy/vacancy.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    JobSeekerModule,
    VacancyModule,
    CompanyModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationRepository],
})
export class ApplicationModule {}
