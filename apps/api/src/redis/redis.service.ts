import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { ChainableCommander } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('RedisClient') private readonly redis: Redis) {}

  onModuleDestroy(): void {
    this.redis.disconnect();
  }

  async setex(key: string, value: string, seconds: number): Promise<void> {
    await this.redis.setex(key, seconds, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async getdel(key: string): Promise<string | null> {
    return this.redis.getdel(key);
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    return this.redis.mget(keys);
  }

  async scan(
    cursor: string,
    pattern: string,
    count: number,
  ): Promise<[cursor: string, elements: string[]]> {
    return this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', count);
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  pipeline(): ChainableCommander {
    return this.redis.pipeline();
  }
}
