import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const clientUrl = this.config.getOrThrow<string>('client.url');
    const verifyLink = `${clientUrl}/confirm-page?token=${token}`;

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
    const clientUrl = this.config.getOrThrow<string>('client.url');
    const resetLink = `${clientUrl}/reset-password?token=${token}`;

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
