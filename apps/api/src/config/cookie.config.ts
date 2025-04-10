import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieConfig {
  constructor(private readonly configService: ConfigService) {}

  get secure(): boolean {
    return this.configService.getOrThrow<boolean>('cookie.secure');
  }

  get httpOnly(): boolean {
    return this.configService.getOrThrow<boolean>('cookie.httpOnly');
  }

  get sameSite(): 'lax' | 'strict' | 'none' {
    return this.configService.getOrThrow<'lax' | 'strict' | 'none'>(
      'cookie.sameSite',
    );
  }

  get maxAge(): number {
    return this.configService.getOrThrow<number>('cookie.maxAge');
  }

  get path(): string {
    return this.configService.getOrThrow<string>('cookie.path');
  }
}
