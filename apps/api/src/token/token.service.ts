import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { VERIFY_PREFIX } from './constants/token.constants';

@Injectable()
export class TokenService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async createVerifyToken(email: string): Promise<string> {
    const token = randomUUID();

    const key = this.verifyKey(token);

    const ttl = this.configService.getOrThrow<number>('token.verify.ttl');

    await this.redisService.setex(key, email, ttl);

    return token;
  }

  async consumeVerifyToken(token: string): Promise<string | null> {
    const key = this.verifyKey(token);
    return this.redisService.getdel(key);
  }

  private verifyKey(token: string): string {
    return `${VERIFY_PREFIX}${token}`;
  }
}
