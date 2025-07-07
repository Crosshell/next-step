import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';

@Module({
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
