import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfig {
  constructor(private readonly configService: ConfigService) {}

  get secret(): string {
    return this.configService.getOrThrow<string>('jwt.secret');
  }

  get accessExpiresIn(): string {
    return this.configService.getOrThrow<string>('jwt.accessExpiresIn');
  }

  get refreshExpiresIn(): string {
    return this.configService.getOrThrow<string>('jwt.refreshExpiresIn');
  }
}
