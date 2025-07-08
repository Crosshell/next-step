import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyGuard } from './guards/company.guard';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyGuard],
  exports: [CompanyGuard],
})
export class CompanyModule {}
