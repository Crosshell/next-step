import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCleanupService } from './user-cleanup.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule],
  providers: [UserCleanupService],
})
export class SchedulerModule {}
