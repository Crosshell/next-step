import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
