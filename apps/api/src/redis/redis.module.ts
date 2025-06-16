import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'RedisClient',
      useFactory: async (configService: ConfigService) => {
        return new Redis({
          host: configService.getOrThrow('redis.host'),
          port: configService.getOrThrow('redis.port'),
        });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
