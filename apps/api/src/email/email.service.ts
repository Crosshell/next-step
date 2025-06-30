/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const baseUrl = this.configService.getOrThrow<string>('baseUrl');
    const verifyLink = `http://localhost:3000/confirm-page?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Confirmation',
      template: 'verify-email',
      context: {
        verifyLink,
      },
    });
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const baseUrl = this.configService.getOrThrow<string>('baseUrl');
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      template: 'reset-password',
      context: {
        resetLink,
      },
    });
  }
}
