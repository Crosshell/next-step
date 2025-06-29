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
    const baseUrl = this.configService.getOrThrow('baseUrl');
    const verifyLink = `${baseUrl}/auth/verify?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Confirmation',
      template: 'verify-email',
      context: {
        verifyLink,
      },
    });
  }
}
