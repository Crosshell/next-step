import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { TokenType } from './enums/token-type.enum';

@Injectable()
export class TokenService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}
  async createToken(type: TokenType, email: string): Promise<string> {
    const token = randomUUID();
    const key = this.tokenKey(type, token);
    const ttl = this.tokenTtl(type);

    await this.redisService.setex(key, email, ttl);
    return token;
  }

  async consumeToken(type: TokenType, token: string): Promise<string | null> {
    const key = this.tokenKey(type, token);
    return this.redisService.getdel(key);
  }

  private tokenKey(type: TokenType, token: string): string {
    return `${type}:${token}`;
  }

  private tokenTtl(type: TokenType): number {
    return {
      [TokenType.VERIFY]: this.configService.getOrThrow('token.verify.ttl'),
      [TokenType.RESET]: this.configService.getOrThrow('token.reset.ttl'),
    }[type];
  }
}
