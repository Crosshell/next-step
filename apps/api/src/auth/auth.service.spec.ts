import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { SessionService } from '../session/session.service';
import { EmailService } from '../email/email.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { UserWithoutPassword } from '../user/types/user-without-password.type';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('argon2');
const mockedArgon2 = argon2 as jest.Mocked<typeof argon2>;

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let sessionService: jest.Mocked<SessionService>;
  let emailService: jest.Mocked<EmailService>;
  let tokenService: jest.Mocked<TokenService>;

  const mockUserWithoutPassword: UserWithoutPassword = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    type: 'COMPANY',
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserService = {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findOneOrThrow: jest.fn(),
    };

    const mockSessionService = {
      createSession: jest.fn(),
      deleteSession: jest.fn(),
      deleteAllSessions: jest.fn(),
    };

    const mockEmailService = {
      sendVerificationEmail: jest.fn(),
      sendResetPasswordEmail: jest.fn(),
    };

    const mockTokenService = {
      createToken: jest.fn(),
      consumeToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    sessionService = module.get(SessionService);
    emailService = module.get(EmailService);
    tokenService = module.get(TokenService);

    jest.clearAllMocks();
  });

  describe('validateCredentials', () => {
    const dto: LoginDto = {
      email: 'test@gmail.com',
      password: '12345678',
    };

    const mockUser: User = {
      ...mockUserWithoutPassword,
      password: 'hashedPassword',
    };

    it('should validate credentials and return user', async () => {
      userService.findOne.mockResolvedValue(mockUser);
      mockedArgon2.verify.mockResolvedValue(true);

      const result = await service.validateCredentials(dto);

      expect(userService.findOne).toHaveBeenCalledWith(
        { email: dto.email },
        false,
      );
      expect(mockedArgon2.verify).toHaveBeenCalledWith(
        mockUser.password,
        dto.password,
      );
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(service.validateCredentials(dto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(userService.findOne).toHaveBeenCalledWith(
        { email: dto.email },
        false,
      );
      expect(mockedArgon2.verify).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      userService.findOne.mockResolvedValue(mockUser);
      mockedArgon2.verify.mockResolvedValue(false);

      await expect(service.validateCredentials(dto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(userService.findOne).toHaveBeenCalledWith(
        { email: dto.email },
        false,
      );
      expect(mockedArgon2.verify).toHaveBeenCalledWith(
        mockUser.password,
        dto.password,
      );
    });
  });
});
