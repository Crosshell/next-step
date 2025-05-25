import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CookieService } from '../../cookie/cookie.service';
import fromExtractors = ExtractJwt.fromExtractors;
import { JwtConfig } from '../../config/jwt.config';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { UserService } from '../../user/user.service';
import { TokenType, User } from '@prisma/client';
import { TokenService } from '../../token/token.service';
import * as argon2 from 'argon2';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly jwtConfig: JwtConfig,
    private readonly cookieService: CookieService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: fromExtractors([
        (req: Request) => this.extractRefresh(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtPayloadDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const currentRefreshToken = this.cookieService.getRefreshToken(req);
    if (!currentRefreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const storedRefreshToken = await this.tokenService.findToken(
      user.id,
      TokenType.REFRESH,
    );

    const isValidToken =
      storedRefreshToken?.hash &&
      (await argon2.verify(storedRefreshToken.hash, currentRefreshToken));

    if (!isValidToken) {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  private extractRefresh(req: Request): string | null {
    return this.cookieService.getRefreshToken(req);
  }
}
