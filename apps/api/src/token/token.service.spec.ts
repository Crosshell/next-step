import { TokenService } from './token.service';
import { RedisService } from '../redis/redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenType } from './enums/token-type.enum';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(),
}));

const mockedRandomUUID = jest.mocked(randomUUID);

describe('TokenService', () => {
  let service: TokenService;
  let redis: jest.Mocked<RedisService>;
  let config: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockRedis = {
      setex: jest.fn(),
      getdel: jest.fn(),
    };

    const mockConfig = {
      getOrThrow: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: RedisService,
          useValue: mockRedis,
        },
        {
          provide: ConfigService,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    redis = module.get(RedisService);
    config = module.get(ConfigService);

    jest.clearAllMocks();
  });

  describe('createToken', () => {
    const type: TokenType = TokenType.VERIFY;
    const email: string = 'test@gmail.com';
    const token = '123e4567-e89b-12d3-a456-426614174000';
    const key = `${type}:${token}`;
    const ttl = 10;

    it('should create a token', async () => {
      mockedRandomUUID.mockReturnValue(token);
      redis.setex.mockResolvedValue(undefined);
      config.getOrThrow.mockReturnValue(ttl);

      const result = await service.createToken(type, email);

      expect(mockedRandomUUID).toHaveBeenCalled();
      expect(redis.setex).toHaveBeenCalledWith(key, email, ttl);
      expect(result).toEqual(token);
    });
  });

  describe('consumeToken', () => {
    const type: TokenType = TokenType.VERIFY;
    const token: string = '123e4567-e89b-12d3-a456-426614174000';
    const key = `${type}:${token}`;

    it('should consume a token', async () => {
      redis.getdel.mockResolvedValue(token);

      const result = await service.consumeToken(type, token);

      expect(redis.getdel).toHaveBeenCalledWith(key);
      expect(result).toEqual(token);
    });

    it('should return null if token does not exist', async () => {
      redis.getdel.mockResolvedValue(null);

      const result = await service.consumeToken(type, token);

      expect(redis.getdel).toHaveBeenCalledWith(key);
      expect(result).toEqual(null);
    });
  });
});
