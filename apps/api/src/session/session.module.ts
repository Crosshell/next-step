import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { RedisModule } from '../redis/redis.module';
import { SessionController } from './session.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [RedisModule, UserModule],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
