import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LanguageRepository } from './language.repository';

@Module({
  imports: [PrismaModule],
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepository],
  exports: [LanguageService],
})
export class LanguageModule {}
