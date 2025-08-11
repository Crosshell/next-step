import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SessionService } from './session.service';
import { RedisService } from '../redis/redis.service';
import { randomUUID } from 'node:crypto';
import { Session } from './schemas/session.schema';

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(),
}));

const mockedRandomUUID = randomUUID as jest.MockedFunction<typeof randomUUID>;

describe('SessionService', () => {
  let service: SessionService;
  let redis: jest.Mocked<RedisService>;

  const mockPipeline = {
    setex: jest.fn().mockReturnThis(),
    del: jest.fn().mockReturnThis(),
    expire: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  };

  const sid = '123e4567-e89b-12d3-a456-426614174001';
  const userId = '123e4567-e89b-12d3-a456-426614174000';

  const mockSession: Session = {
    sid,
    userId,
    ua: 'Mozilla/5.0',
    ip: '192.168.1.1',
  };

  beforeEach(async () => {
    const mockRedisService = {
      get: jest.fn(),
      mget: jest.fn(),
      ttl: jest.fn(),
      scan: jest.fn(),
      pipeline: jest.fn(() => mockPipeline),
    };

    const mockConfigService = {
      getOrThrow: jest.fn().mockImplementation((key: string) => {
        if (key === 'session.max') return 3;
        if (key === 'session.ttl') return 3600;
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    redis = module.get(RedisService);

    jest.clearAllMocks();
  });

  describe('createSession', () => {
    const ua = 'Mozilla/5.0';
    const ip = '192.168.1.1';

    it('should create a new session', async () => {
      redis.scan.mockResolvedValueOnce(['0', []]);
      mockedRandomUUID.mockReturnValue(sid);

      const result = await service.createSession(userId, ua, ip);

      expect(mockedRandomUUID).toHaveBeenCalled();
      expect(redis.pipeline).toHaveBeenCalled();
      expect(mockPipeline.setex).toHaveBeenCalledTimes(2);
      expect(mockPipeline.exec).toHaveBeenCalled();
      expect(redis.ttl).not.toHaveBeenCalled();
      expect(mockPipeline.del).not.toHaveBeenCalled();
      expect(result).toEqual(sid);
    });

    it('should prune old sessions when max sessions exceeded', async () => {
      const userSessions = [
        `user:sessions:${userId}:123e4567-e89b-12d3-a456-426614174002`,
        `user:sessions:${userId}:123e4567-e89b-12d3-a456-426614174003`,
        `user:sessions:${userId}:123e4567-e89b-12d3-a456-426614174004`,
        `user:sessions:${userId}:123e4567-e89b-12d3-a456-426614174005`,
      ];

      redis.scan.mockResolvedValueOnce(['0', userSessions]);

      redis.ttl
        .mockResolvedValueOnce(1000)
        .mockResolvedValueOnce(500)
        .mockResolvedValueOnce(1500)
        .mockResolvedValueOnce(2000);

      const sessionToDelete: Session = {
        sid: '123e4567-e89b-12d3-a456-426614174003',
        userId,
        ua: 'old-ua',
        ip: 'old-ip',
      };
      redis.get.mockResolvedValueOnce(JSON.stringify(sessionToDelete));

      await service.createSession(userId, ua, ip);

      expect(redis.ttl).toHaveBeenCalledTimes(userSessions.length);
      expect(redis.get).toHaveBeenCalledWith(
        'session:123e4567-e89b-12d3-a456-426614174003',
      );
      expect(mockPipeline.del).toHaveBeenCalledTimes(2);
    });
  });

  describe('getSession', () => {
    it('should return session when exists and valid', async () => {
      redis.get.mockResolvedValue(JSON.stringify(mockSession));

      const result = await service.getSession(sid);

      expect(result).toEqual(mockSession);
      expect(redis.get).toHaveBeenCalledWith(`session:${sid}`);
    });

    it('should return null when session does not exist', async () => {
      redis.get.mockResolvedValue(null);

      const result = await service.getSession(sid);

      expect(redis.get).toHaveBeenCalledWith(`session:${sid}`);
      expect(result).toBeNull();
    });

    it('should return null when session data is invalid', async () => {
      redis.get.mockResolvedValue('{ "invalid": true }');

      const result = await service.getSession(sid);

      expect(result).toBeNull();
    });
  });

  describe('deleteSession', () => {
    it('should delete session successfully', async () => {
      redis.get.mockResolvedValue(JSON.stringify(mockSession));

      await service.deleteSession(sid);

      expect(mockPipeline.del).toHaveBeenCalledWith(
        `session:${mockSession.sid}`,
      );
      expect(mockPipeline.del).toHaveBeenCalledWith(
        `user:sessions:${mockSession.userId}:${mockSession.sid}`,
      );
      expect(mockPipeline.exec).toHaveBeenCalled();
    });

    it('should handle deletion when session does not exist', async () => {
      redis.get.mockResolvedValue(null);

      await service.deleteSession(sid);

      expect(mockPipeline.del).not.toHaveBeenCalled();
      expect(mockPipeline.exec).not.toHaveBeenCalled();
    });
  });

  describe('deleteAllSessions', () => {
    it('should delete all user sessions', async () => {
      const sids = [
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174002',
        '123e4567-e89b-12d3-a456-426614174003',
      ];

      redis.scan.mockResolvedValueOnce([
        '0',
        sids.map((sid) => `user:sessions:${userId}:${sid}`),
      ]);

      sids.forEach((sid, index) => {
        const sessionData: Session = {
          sid,
          userId,
          ua: `ua${index}`,
          ip: `ip${index}`,
        };
        redis.get.mockResolvedValueOnce(JSON.stringify(sessionData));
      });

      await service.deleteAllSessions(userId);

      expect(redis.get).toHaveBeenCalledTimes(3);
      expect(mockPipeline.del).toHaveBeenCalledTimes(6);
    });

    it('should handle user with no sessions', async () => {
      redis.scan.mockResolvedValueOnce(['0', []]);

      await service.deleteAllSessions(userId);

      expect(redis.get).not.toHaveBeenCalled();
      expect(mockPipeline.del).not.toHaveBeenCalled();
    });
  });

  describe('refreshSessionTTL', () => {
    it('should refresh TTL for both session keys', async () => {
      await service.refreshSessionTTL(userId, sid);

      expect(mockPipeline.expire).toHaveBeenCalledWith(`session:${sid}`, 3600);
      expect(mockPipeline.expire).toHaveBeenCalledWith(
        `user:sessions:${userId}:${sid}`,
        3600,
      );
      expect(mockPipeline.exec).toHaveBeenCalled();
    });
  });

  describe('getUserSessions', () => {
    const sessions: Session[] = [
      {
        sid: '123e4567-e89b-12d3-a456-426614174001',
        userId,
        ua: 'ua1',
        ip: 'ip1',
      },
      {
        sid: '123e4567-e89b-12d3-a456-426614174002',
        userId,
        ua: 'ua2',
        ip: 'ip2',
      },
    ];
    it('should return all valid user sessions', async () => {
      redis.scan.mockResolvedValueOnce([
        '0',
        [
          `user:sessions:${userId}:${sessions[0].sid}`,
          `user:sessions:${userId}:${sessions[1].sid}`,
        ],
      ]);

      redis.mget.mockResolvedValue([
        JSON.stringify(sessions[0]),
        JSON.stringify(sessions[1]),
      ]);

      const result = await service.getUserSessions(userId);

      expect(result).toEqual(sessions);
      expect(redis.mget).toHaveBeenCalledWith([
        `session:${sessions[0].sid}`,
        `session:${sessions[1].sid}`,
      ]);
    });

    it('should filter out invalid session data', async () => {
      redis.scan.mockResolvedValueOnce([
        '0',
        [
          `user:sessions:${userId}:${sessions[0].sid}`,
          `user:sessions:${userId}:${sessions[1].sid}`,
        ],
      ]);

      redis.mget.mockResolvedValue([
        JSON.stringify(mockSession),
        '{ "invalid": true }',
      ]);

      const result = await service.getUserSessions(userId);

      expect(result).toEqual([mockSession]);
    });

    it('should handle user with no sessions', async () => {
      redis.scan.mockResolvedValueOnce(['0', []]);
      redis.mget.mockResolvedValueOnce([]);

      const result = await service.getUserSessions(userId);

      expect(result).toEqual([]);
      expect(redis.mget).toHaveBeenCalledWith([]);
    });
  });
});
