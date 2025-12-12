import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { SessionService } from '../../session/services/session.service';
import { EmailService } from '../../email/services/email.service';
import { TokenService } from '../../token/services/token.service';
import * as argon2 from 'argon2';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenType } from '../../token/enums/token-type.enum';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserWithoutPassword } from '../../user/types/user-without-password.type';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

jest.mock('argon2');
const mockedArgon2 = argon2 as jest.Mocked<typeof argon2>;

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let sessionService: jest.Mocked<SessionService>;
  let emailService: jest.Mocked<EmailService>;
  let tokenService: jest.Mocked<TokenService>;

  const TOKEN = 'valid-token';

  const mockUser = {
    id: 'user-uuid-1',
    email: 'test@test.com',
    password: 'hashed-password',
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  const mockUserWithoutPassword = {
    ...mockUser,
    password: undefined,
  } as UserWithoutPassword;

  const mockSession = {
    sid: 'session-uuid-1',
    userId: mockUser.id,
    ua: 'TestAgent',
    ip: '127.0.0.1',
  };

  const mockUserService = {
    findOneWithPassword: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findOneOrThrow: jest.fn(),
  };

  const mockSessionService = {
    createSession: jest.fn(),
    deleteSession: jest.fn(),
    deleteAllSessions: jest.fn(),
    getUserSessions: jest.fn(),
  };

  const mockEmailService = {
    sendVerificationEmail: jest.fn(),
    sendResetPasswordEmail: jest.fn(),
  };

  const mockTokenService = {
    createToken: jest.fn(),
    consumeToken: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'NODE_ENV') return 'test';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    sessionService = module.get(SessionService);
    emailService = module.get(EmailService);
    tokenService = module.get(TokenService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateCredentials', () => {
    const dto: LoginDto = { email: mockUser.email, password: 'password123' };

    it('should return user without password if credentials are valid', async () => {
      userService.findOneWithPassword.mockResolvedValue(mockUser);
      mockedArgon2.verify.mockResolvedValue(true);

      const result = await service.validateCredentials(dto);

      expect(userService.findOneWithPassword).toHaveBeenCalledWith({
        email: mockUser.email,
      });
      expect(mockedArgon2.verify).toHaveBeenCalledWith(
        mockUser.password,
        dto.password,
      );
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userService.findOneWithPassword.mockResolvedValue(null);

      await expect(service.validateCredentials(dto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockedArgon2.verify).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      userService.findOneWithPassword.mockResolvedValue(mockUser);
      mockedArgon2.verify.mockResolvedValue(false);

      await expect(service.validateCredentials(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should create session if email is verified', async () => {
      const user = { ...mockUserWithoutPassword, isEmailVerified: true };
      sessionService.createSession.mockResolvedValue(mockSession.sid);

      const result = await service.login(user, mockSession.ua, mockSession.ip);

      expect(result).toBe(mockSession.sid);
      expect(sessionService.createSession).toHaveBeenCalledWith(user.id, {
        ua: mockSession.ua,
        ip: mockSession.ip,
      });
    });

    it('should throw ForbiddenException if email is not verified', async () => {
      const user = { ...mockUserWithoutPassword, isEmailVerified: false };

      await expect(
        service.login(user, mockSession.ua, mockSession.ip),
      ).rejects.toThrow(ForbiddenException);

      expect(sessionService.createSession).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const dto: RegisterDto = { email: mockUser.email, password: 'password123' };

    it('should create user, generate token and send email', async () => {
      tokenService.createToken.mockResolvedValue(TOKEN);

      await service.register(dto);

      expect(userService.create).toHaveBeenCalledWith(dto);
      expect(tokenService.createToken).toHaveBeenCalledWith(TokenType.VERIFY, {
        email: mockUser.email,
      });
      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
        mockUser.email,
        TOKEN,
      );
    });

    it('should throw BadRequestException if user already exists', async () => {
      userService.create.mockRejectedValue(new BadRequestException());

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);

      expect(tokenService.createToken).not.toHaveBeenCalled();
      expect(emailService.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('logout should call deleteSession', async () => {
      await service.logout(mockSession.sid);
      expect(sessionService.deleteSession).toHaveBeenCalledWith(
        mockSession.sid,
      );
    });
  });

  describe('logoutAll', () => {
    it('logoutAll should call deleteAllSessions', async () => {
      await service.logoutAll(mockUser.id);
      expect(sessionService.deleteAllSessions).toHaveBeenCalledWith(
        mockUser.id,
      );
    });
  });

  describe('getSessions', () => {
    it('getSessions should call getUserSessions', async () => {
      const sessions = [mockSession];
      sessionService.getUserSessions.mockResolvedValue(sessions);

      const result = await service.getSessions(mockUser.id);
      expect(result).toBe(sessions);
      expect(sessionService.getUserSessions).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email if token is valid', async () => {
      tokenService.consumeToken.mockResolvedValue({ email: mockUser.email });

      await service.verifyEmail(TOKEN);

      expect(tokenService.consumeToken).toHaveBeenCalledWith(
        TokenType.VERIFY,
        TOKEN,
      );
      expect(userService.update).toHaveBeenCalledWith(
        { email: mockUser.email },
        { isEmailVerified: true },
      );
    });

    it('should throw BadRequestException if token is invalid or expired', async () => {
      tokenService.consumeToken.mockResolvedValue(null);

      await expect(service.verifyEmail(TOKEN)).rejects.toThrow(
        BadRequestException,
      );
      expect(userService.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if token payload misses email', async () => {
      tokenService.consumeToken.mockResolvedValue({});

      await expect(service.verifyEmail(TOKEN)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('resendVerification', () => {
    const dto = { email: mockUser.email };

    it('should resend email verify letter', async () => {
      userService.findOneOrThrow.mockResolvedValue({
        ...mockUserWithoutPassword,
        isEmailVerified: false,
      });
      tokenService.createToken.mockResolvedValue(TOKEN);

      await service.resendVerification(dto);

      expect(tokenService.createToken).toHaveBeenCalledWith(TokenType.VERIFY, {
        email: mockUser.email,
      });
      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
        mockUser.email,
        TOKEN,
      );
    });

    it('should throw BadRequestException if user is already verified', async () => {
      userService.findOneOrThrow.mockResolvedValue({
        ...mockUser,
        isEmailVerified: true,
      });

      await expect(service.resendVerification(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(tokenService.createToken).not.toHaveBeenCalled();
      expect(emailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      userService.findOneOrThrow.mockRejectedValue(new NotFoundException());

      await expect(service.resendVerification(dto)).rejects.toThrow(
        NotFoundException,
      );

      expect(tokenService.createToken).not.toHaveBeenCalled();
      expect(emailService.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    const dto = { email: mockUser.email };

    it('should generate token and send reset email', async () => {
      userService.findOneOrThrow.mockResolvedValue(mockUser);
      tokenService.createToken.mockResolvedValue(TOKEN);

      await service.forgotPassword(dto);

      expect(tokenService.createToken).toHaveBeenCalledWith(TokenType.RESET, {
        email: mockUser.email,
      });
      expect(emailService.sendResetPasswordEmail).toHaveBeenCalledWith(
        mockUser.email,
        TOKEN,
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      userService.findOneOrThrow.mockRejectedValue(new NotFoundException());

      await expect(service.forgotPassword(dto)).rejects.toThrow(
        NotFoundException,
      );

      expect(tokenService.createToken).not.toHaveBeenCalled();
      expect(emailService.sendResetPasswordEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    const dto = { token: TOKEN, password: 'newPassword' };

    it('should update password', async () => {
      tokenService.consumeToken.mockResolvedValue({ email: mockUser.email });

      await service.resetPassword(dto);

      expect(tokenService.consumeToken).toHaveBeenCalledWith(
        TokenType.RESET,
        TOKEN,
      );
      expect(userService.update).toHaveBeenCalledWith(
        { email: mockUser.email },
        { password: dto.password },
      );
    });

    it('should throw BadRequestException if token is invalid or expired', async () => {
      tokenService.consumeToken.mockResolvedValue(null);

      await expect(service.resetPassword(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userService.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if token payload misses email', async () => {
      tokenService.consumeToken.mockResolvedValue({});

      await expect(service.resetPassword(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
