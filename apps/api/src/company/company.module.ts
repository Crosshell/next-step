import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyGuard } from './guards/company.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyGuard],
  exports: [CompanyGuard],
})
export class CompanyModule {}
