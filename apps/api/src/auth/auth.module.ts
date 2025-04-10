import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtConfig } from '../config/jwt.config';
import { CookieService } from '../cookie.service';
import { CookieConfig } from '../config/cookie.config';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [UserModule, PassportModule, TokenModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    CookieService,
    JwtConfig,
    CookieConfig,
    RefreshStrategy,
  ],
})
export class AuthModule {}
