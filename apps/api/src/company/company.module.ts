import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyGuard } from './guards/company.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CompanyRepository } from './company.repository';
import { CreateCompanyGuard } from './guards/create-company.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    CompanyGuard,
    CreateCompanyGuard,
    CompanyRepository,
  ],
  exports: [CompanyService, CompanyGuard],
})
export class CompanyModule {}
