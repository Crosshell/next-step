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
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { TokenType } from '../token/enums/token-type.enum';

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
    isEmailVerified: true,
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
      email: 'test@example.com',
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

  describe('login', () => {
    const ua: string = 'Safari/537.36';
    const ip: string = '127.0.0.1';
    const sid: string = '123e4567-e89b-12d3-a456-426614174102';

    it('should login by creating a session and returning a token', async () => {
      sessionService.createSession.mockResolvedValue(sid);

      const result = await service.login(mockUserWithoutPassword, ua, ip);

      expect(sessionService.createSession).toHaveBeenCalledWith(
        mockUserWithoutPassword.id,
        ua,
        ip,
      );
      expect(result).toEqual(sid);
    });

    it('should throw ForbiddenException if user email is not verified', async () => {
      const unverifiedUser: UserWithoutPassword = {
        ...mockUserWithoutPassword,
        isEmailVerified: false,
      };

      await expect(service.login(unverifiedUser, ua, ip)).rejects.toThrow(
        new ForbiddenException('Verify your email address first'),
      );

      expect(sessionService.createSession).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: '12345678',
      type: 'COMPANY',
    };

    const token = '123e4567-e89b-12d3-a456-426614174102';

    it('should register a user', async () => {
      userService.create.mockResolvedValue(mockUserWithoutPassword);
      tokenService.createToken.mockResolvedValue(token);
      emailService.sendVerificationEmail.mockResolvedValue(undefined);

      const result = await service.register(dto);

      expect(userService.create).toHaveBeenCalledWith(dto);
      expect(tokenService.createToken).toHaveBeenCalledWith(
        TokenType.VERIFY,
        dto.email,
      );
      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
        dto.email,
        token,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('logout', () => {
    const sid: string = '123e4567-e89b-12d3-a456-426614174102';
    it('should logout user', async () => {
      sessionService.deleteSession.mockResolvedValue(undefined);

      const result = await service.logout(sid);

      expect(sessionService.deleteSession).toHaveBeenCalledWith(sid);
      expect(result).toBeUndefined();
    });
  });

  describe('logoutAll', () => {
    const userId: string = '123e4567-e89b-12d3-a456-426614174102';

    it('should logout all user sessions', async () => {
      sessionService.deleteAllSessions.mockResolvedValue(undefined);

      const result = await service.logoutAll(userId);

      expect(sessionService.deleteAllSessions).toHaveBeenCalledWith(userId);
      expect(result).toBeUndefined();
    });
  });
  // describe('verifyEmail', () => {});
  // describe('resendVerification', () => {});
  // describe('forgotPassword', () => {});
  // describe('resetPassword', () => {});
});
