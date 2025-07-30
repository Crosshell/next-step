import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SkillRepository } from './skill.repository';

@Module({
  imports: [PrismaModule],
  controllers: [SkillController],
  providers: [SkillService, SkillRepository],
  exports: [SkillService],
})
export class SkillModule {}
