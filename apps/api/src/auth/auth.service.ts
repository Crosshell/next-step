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
  InvalidCredentialsException,
  EmailNotVerifiedException,
  SubjectNotFoundException,
  EmailVerifiedException,
  InvalidOrExpiredSubjectException,
} from '@common/exceptions';

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

    const verifyToken = await this.tokenService.createVerifyToken(
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
    const email = await this.tokenService.consumeVerifyToken(token);
    if (!email) {
      throw new InvalidOrExpiredSubjectException('token');
    }

    await this.userService.markEmailVerified(email);
  }

  async resendVerificationLink(email: string): Promise<void> {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new SubjectNotFoundException('User');
    }

    if (user.isEmailVerified) {
      throw new EmailVerifiedException();
    }

    const verifyToken = await this.tokenService.createVerifyToken(user.email);
    await this.emailService.sendVerificationEmail(user.email, verifyToken);
  }
}
