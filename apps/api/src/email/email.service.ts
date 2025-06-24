import { Injectable } from '@nestjs/common';
import { Transporter, createTransport, SendMailOptions } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport(this.configService.getOrThrow('email'));
  }

  async sendEmail(options: SendMailOptions): Promise<void> {
    await this.transporter.sendMail(options);
  }
}
