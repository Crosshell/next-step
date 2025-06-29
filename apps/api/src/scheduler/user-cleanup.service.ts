import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserCleanupService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async purgeUnverifiedAccounts(): Promise<void> {
    const ttl = this.configService.getOrThrow<number>('user.unverifiedTtlMs');
    const threshold = new Date(Date.now() - ttl);

    await this.userService.deleteMany({
      isEmailVerified: false,
      createdAt: {
        lt: threshold,
      },
    });
  }
}
