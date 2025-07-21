import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserCleanupService {
  constructor(
    private readonly service: UserService,
    private readonly config: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async purgeUnverifiedAccounts(): Promise<void> {
    const ttl = this.config.getOrThrow<number>('user.unverifiedTtlMs');
    const threshold = new Date(Date.now() - ttl);

    await this.service.deleteMany({
      isEmailVerified: false,
      createdAt: {
        lt: threshold,
      },
    });
  }
}
