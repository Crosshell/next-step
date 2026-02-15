import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { RegisterDto } from '../dto/register.dto';
import { UserWithoutPassword } from '../../user/types/user-without-password.type';
import * as argon2 from 'argon2';
import { LoginDto } from '../dto/login.dto';
import { SessionService } from '../../session/services/session.service';
import { EmailService } from '../../email/services/email.service';
import { TokenService } from '../../token/services/token.service';
import { TokenType } from '../../token/enums/token-type.enum';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { SessionPayload } from '../../session/schemas/session-payload.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async validateCredentials(dto: LoginDto): Promise<UserWithoutPassword> {
    const user = await this.userService.findOneWithPassword({
      email: dto.email,
    });

    const isValid = user && (await argon2.verify(user.password, dto.password));

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async login(
    user: UserWithoutPassword,
    ua: string,
    ip: string,
  ): Promise<string> {
    if (!user.isEmailVerified) {
      throw new ForbiddenException('Verify your email address first');
    }
    return this.sessionService.createSession(user.id, { ua, ip });
  }

  async register(dto: RegisterDto): Promise<void> {
    await this.userService.create(dto);

    const verifyToken = await this.tokenService.createToken(TokenType.VERIFY, {
      email: dto.email,
    });
    await this.emailService.sendVerificationEmail(dto.email, verifyToken);
  }

  async logout(sid: string): Promise<void> {
    await this.sessionService.deleteSession(sid);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionService.deleteAllSessions(userId);
  }

  async getSessions(userId: string): Promise<SessionPayload[]> {
    return this.sessionService.getUserSessions(userId);
  }

  async verifyEmail(token: string): Promise<void> {
    const data = await this.tokenService.consumeToken(TokenType.VERIFY, token);
    if (!data || !data.email) {
      throw new BadRequestException('Invalid or expired verify token');
    }

    await this.userService.update(
      { email: data.email },
      { isEmailVerified: true },
    );
  }

  async resendVerification(dto: ResendVerificationDto): Promise<void> {
    const user = await this.userService.findOneOrThrow({
      email: dto.email,
    });

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const verifyToken = await this.tokenService.createToken(TokenType.VERIFY, {
      email: dto.email,
    });
    await this.emailService.sendVerificationEmail(dto.email, verifyToken);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    await this.userService.findOneOrThrow({
      email: dto.email,
    });

    const resetToken = await this.tokenService.createToken(TokenType.RESET, {
      email: dto.email,
    });
    await this.emailService.sendResetPasswordEmail(dto.email, resetToken);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const data = await this.tokenService.consumeToken(
      TokenType.RESET,
      dto.token,
    );
    if (!data || !data.email) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.userService.update(
      { email: data.email },
      { password: dto.password },
    );
  }
}
