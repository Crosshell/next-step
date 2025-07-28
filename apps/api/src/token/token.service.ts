import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { TokenType } from './enums/token-type.enum';

@Injectable()
export class TokenService {
  constructor(
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}
  async createToken(type: TokenType, email: string): Promise<string> {
    const token = randomUUID();
    const key = this.tokenKey(type, token);
    const ttl = this.tokenTtl(type);

    await this.redis.setex(key, email, ttl);
    return token;
  }

  async consumeToken(type: TokenType, token: string): Promise<string | null> {
    const key = this.tokenKey(type, token);
    return this.redis.getdel(key);
  }

  private tokenKey(type: TokenType, token: string): string {
    return `${type}:${token}`;
  }

  private tokenTtl(type: TokenType): number {
    return {
      [TokenType.VERIFY]: this.config.getOrThrow<number>('token.verify.ttl'),
      [TokenType.RESET]: this.config.getOrThrow<number>('token.reset.ttl'),
    }[type];
  }
}
