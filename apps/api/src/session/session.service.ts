import { Injectable } from '@nestjs/common';
import { SessionData } from './types/session-data';
import { RedisService } from '../redis/redis.service';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}
  async createSession(sessionData: SessionData): Promise<string> {
    const sid = randomUUID();

    await this.saveSession(sid, sessionData);
    await this.deleteExpiredUserSessions(sessionData.userId);
    return sid;
  }

  async getSessionData(sid: string): Promise<SessionData | null> {
    const key = this.getSessionKey(sid);
    const value = await this.redisService.get(key);

    if (!value) return null;

    return JSON.parse(value);
  }

  async deleteSession(sid: string): Promise<void> {
    const sessionData = await this.getSessionData(sid);
    if (!sessionData) return;

    const sessionKey = this.getSessionKey(sid);
    const userSessionsKey = this.getUserSessionsKey(sessionData.userId);

    const pipeline = this.redisService.pipeline();

    pipeline.del(sessionKey);
    pipeline.lrem(userSessionsKey, 0, sid);

    await pipeline.exec();
  }

  async deleteAllSessions(userId: string): Promise<void> {
    const userSessionsKey = this.getUserSessionsKey(userId);
    const storedUserSids = await this.redisService.lrange(
      userSessionsKey,
      0,
      -1,
    );

    if (storedUserSids.length === 0) return;

    const pipeline = this.redisService.pipeline();

    for (const sid of storedUserSids) {
      const key = this.getSessionKey(sid);
      pipeline.del(key);
    }

    pipeline.del(userSessionsKey);

    await pipeline.exec();
  }

  private async saveSession(
    sid: string,
    sessionData: SessionData,
  ): Promise<void> {
    const ttl = this.configService.getOrThrow<number>('session.ttl');
    const maxSessions = this.configService.getOrThrow<number>('session.max');

    const sessionKey = this.getSessionKey(sid);
    const userSessionsKey = this.getUserSessionsKey(sessionData.userId);

    const value = JSON.stringify(sessionData);

    const pipeline = this.redisService.pipeline();

    pipeline.setex(sessionKey, ttl, value);
    pipeline.lpush(userSessionsKey, sid);
    pipeline.ltrim(userSessionsKey, 0, maxSessions - 1);

    await pipeline.exec();
  }

  private async deleteExpiredUserSessions(userId: string): Promise<void> {
    const userSessionsKey = this.getUserSessionsKey(userId);

    const storedUserSids = await this.redisService.lrange(
      userSessionsKey,
      0,
      -1,
    );

    const sessionKeys = storedUserSids.map((sid) => this.getSessionKey(sid));
    const sessions = await this.redisService.mget(sessionKeys);

    const pipeline = this.redisService.pipeline();

    for (let i = 0; i < sessions.length; i++) {
      if (!sessions[i]) {
        pipeline.lrem(userSessionsKey, 0, storedUserSids[i]);
      }
    }

    await pipeline.exec();
  }

  private getSessionKey(sid: string): string {
    return `session:${sid}`;
  }

  private getUserSessionsKey(userId: string): string {
    return `user_sessions:${userId}`;
  }
}
