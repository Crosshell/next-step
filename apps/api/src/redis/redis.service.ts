import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { ChainableCommander } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClient.lrange(key, start, stop);
  }

  async lrem(key: string, count: number, element: string) {
    return this.redisClient.lrem(key, count, element);
  }

  pipeline(): ChainableCommander {
    return this.redisClient.pipeline();
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    return this.redisClient.mget(keys);
  }
}
