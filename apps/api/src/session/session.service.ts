import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import {
  SESSION_PREFIX,
  USER_SESSIONS_PREFIX,
} from './constants/session.constants';
import { SessionSchema, Session } from './schemas/session.schema';

@Injectable()
export class SessionService {
  private readonly maxSessions: number;
  private readonly sessionTTL: number;

  constructor(
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {
    this.maxSessions = this.config.getOrThrow<number>('session.max');
    this.sessionTTL = this.config.getOrThrow<number>('session.ttl');
  }

  async createSession(userId: string, ua: string, ip: string): Promise<string> {
    const sid = randomUUID();

    const session: Session = {
      sid,
      userId,
      ua,
      ip,
    };

    const sessionKey = this.sessionKey(sid);
    const userSessionKey = this.userSessionKey(userId, sid);

    const sids = await this.getSidsByUserId(userId);

    if (sids.length >= this.maxSessions) {
      await this.pruneUserSessions(sids);
    }

    await this.redis
      .pipeline()
      .setex(sessionKey, this.sessionTTL, JSON.stringify(session))
      .setex(userSessionKey, this.sessionTTL, '1')
      .exec();

    return sid;
  }

  async getSession(sid: string): Promise<Session | null> {
    const key = this.sessionKey(sid);
    const data = await this.redis.get(key);

    if (!data) return null;
    const parsed = SessionSchema.safeParse(JSON.parse(data));
    if (!parsed.success) return null;
    return parsed.data;
  }

  async deleteSession(sid: string): Promise<void> {
    const session = await this.getSession(sid);
    if (!session) return;

    const sessionKey = this.sessionKey(sid);
    const userSessionsKey = this.userSessionKey(session.userId, sid);

    await this.redis.pipeline().del(sessionKey).del(userSessionsKey).exec();
  }

  async deleteAllSessions(userId: string): Promise<void> {
    const sids = await this.getSidsByUserId(userId);

    if (sids.length) {
      await Promise.all(
        sids.map((sid) => {
          return this.deleteSession(sid);
        }),
      );
    }
  }

  async refreshSessionTTL(userId: string, sid: string): Promise<void> {
    await this.redis
      .pipeline()
      .expire(this.sessionKey(sid), this.sessionTTL)
      .expire(this.userSessionKey(userId, sid), this.sessionTTL)
      .exec();
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    const sessions: Session[] = [];
    const sids = await this.getSidsByUserId(userId);

    const sessionKeys = sids.map((sid) => this.sessionKey(sid));
    const raw = await this.redis.mget(sessionKeys);

    for (const data of raw) {
      if (data) {
        const parsed = SessionSchema.safeParse(JSON.parse(data));
        if (!parsed.success) continue;
        sessions.push(parsed.data);
      }
    }

    return sessions;
  }

  private async pruneUserSessions(sids: string[]): Promise<void> {
    const sid = await this.findOldestSessionSid(sids);
    await this.deleteSession(sid);
  }

  private async findOldestSessionSid(sids: string[]): Promise<string> {
    let minTtl = Infinity;
    let leastTtlSid: string = sids[0];

    for (const sid of sids) {
      const ttl = await this.redis.ttl(this.sessionKey(sid));
      if (ttl < minTtl) {
        minTtl = ttl;
        leastTtlSid = sid;
      }
    }

    return leastTtlSid;
  }

  private async getSidsByUserId(userId: string): Promise<string[]> {
    const pattern = this.userSessionKey(userId, '*');
    const sids: string[] = [];

    let cursor = '0';
    do {
      const [nextCursor, keys] = await this.redis.scan(cursor, pattern, 10);
      for (const key of keys) {
        sids.push(this.extractSid(key));
      }
      cursor = nextCursor;
    } while (cursor !== '0');
    return sids;
  }

  private sessionKey(sid: string): string {
    return `${SESSION_PREFIX}${sid}`;
  }

  private userSessionKey(userId: string, sid: string): string {
    return `${USER_SESSIONS_PREFIX}${userId}:${sid}`;
  }

  private extractSid(key: string): string {
    const idx = key.lastIndexOf(':');
    return key.substring(idx + 1);
  }
}
