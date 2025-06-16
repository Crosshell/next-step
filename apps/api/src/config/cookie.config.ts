import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class CookieConfig {
  constructor(private readonly configService: ConfigService) {}

  get refreshTokenOptions(): CookieOptions {
    return {
      httpOnly: this.configService.getOrThrow('cookie.httpOnly'),
      secure: this.configService.getOrThrow('cookie.secure'),
      sameSite: this.configService.getOrThrow('cookie.sameSite'),
      maxAge: this.configService.getOrThrow('cookie.maxAge'),
      path: this.configService.getOrThrow('cookie.path'),
    };
  }
}
