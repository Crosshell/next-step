import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
