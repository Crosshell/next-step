import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { ChainableCommander } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async setex(key: string, value: string, seconds: number): Promise<void> {
    await this.redisClient.setex(key, seconds, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async getdel(key: string): Promise<string | null> {
    return this.redisClient.getdel(key);
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    return this.redisClient.mget(keys);
  }

  async scan(
    cursor: string,
    pattern: string,
    count: number,
  ): Promise<[cursor: string, elements: string[]]> {
    return this.redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', count);
  }

  async ttl(key: string): Promise<number> {
    return this.redisClient.ttl(key);
  }

  pipeline(): ChainableCommander {
    return this.redisClient.pipeline();
  }
}
