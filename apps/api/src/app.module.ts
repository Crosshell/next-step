import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { RedisModule } from './redis/redis.module';
import { SessionModule } from './session/session.module';
import { EmailModule } from './email/email.module';
import { TokenModule } from './token/token.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    RedisModule,
    SessionModule,
    EmailModule,
    TokenModule,
    SchedulerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
