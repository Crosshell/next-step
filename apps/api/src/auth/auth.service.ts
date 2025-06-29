import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { UserWithoutPassword } from '../user/types/user-without-password.type';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { SessionService } from '../session/session.service';
import { EmailService } from '../email/email.service';
import { TokenService } from '../token/token.service';
import {
  EmailNotVerifiedException,
  EmailVerifiedException,
  InvalidCredentialsException,
  InvalidOrExpiredSubjectException,
  SubjectNotFoundException,
} from '@common/exceptions';
import { TokenType } from '../token/enums/token-type.enum';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async validateCredentials(loginDto: LoginDto): Promise<UserWithoutPassword> {
    const user = await this.userService.findOne(
      { email: loginDto.email },
      false,
    );

    const isValid =
      user && (await argon2.verify(user.password, loginDto.password));
    if (!isValid) {
      throw new InvalidCredentialsException();
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
      throw new EmailNotVerifiedException();
    }
    return this.sessionService.createSession(user.id, ua, ip);
  }

  async register(registerDto: RegisterDto): Promise<void> {
    await this.userService.create(registerDto);

    const verifyToken = await this.tokenService.createToken(
      TokenType.VERIFY,
      registerDto.email,
    );
    await this.emailService.sendVerificationEmail(
      registerDto.email,
      verifyToken,
    );
  }

  async logout(sid: string): Promise<void> {
    await this.sessionService.deleteSession(sid);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionService.deleteAllSessions(userId);
  }

  async verifyEmail(token: string): Promise<void> {
    const email = await this.tokenService.consumeToken(TokenType.VERIFY, token);
    if (!email) {
      throw new InvalidOrExpiredSubjectException('verify token');
    }

    await this.userService.update({ email }, { isEmailVerified: true });
  }

  async resendVerification(
    resendVerificationDto: ResendVerificationDto,
  ): Promise<void> {
    const user = await this.userService.findOne({
      email: resendVerificationDto.email,
    });

    if (!user) {
      throw new SubjectNotFoundException('User');
    }

    if (user.isEmailVerified) {
      throw new EmailVerifiedException();
    }

    const verifyToken = await this.tokenService.createToken(
      TokenType.VERIFY,
      resendVerificationDto.email,
    );
    await this.emailService.sendVerificationEmail(
      resendVerificationDto.email,
      verifyToken,
    );
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findOne({
      email: forgotPasswordDto.email,
    });
    if (!user) {
      throw new SubjectNotFoundException('User');
    }

    const resetToken = await this.tokenService.createToken(
      TokenType.RESET,
      forgotPasswordDto.email,
    );
    await this.emailService.sendResetPasswordEmail(
      forgotPasswordDto.email,
      resetToken,
    );
  }

  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    const email = await this.tokenService.consumeToken(TokenType.RESET, token);
    if (!email) {
      throw new InvalidOrExpiredSubjectException('reset token');
    }

    await this.userService.update(
      { email },
      { password: resetPasswordDto.password },
    );
  }
}
