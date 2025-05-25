import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { CookieConfig } from '../config/cookie.config';

@Injectable()
export class CookieService {
  constructor(private readonly cookieConfig: CookieConfig) {}

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: this.cookieConfig.httpOnly,
      secure: this.cookieConfig.secure,
      sameSite: this.cookieConfig.sameSite,
      maxAge: this.cookieConfig.maxAge,
      path: this.cookieConfig.path,
    });
  }

  getRefreshToken(req: Request): string | null {
    return req?.cookies?.refreshToken || null;
  }
}
