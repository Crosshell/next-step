import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import fromExtractors = ExtractJwt.fromExtractors;
import { JwtConfig } from '../../config/jwt.config';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { UserService } from '../../user/user.service';
import { TokenService } from '../../token/token.service';
import { UserWithoutPassword } from '../../user/types/user-without-password.type';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly jwtConfig: JwtConfig,
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
  ): Promise<UserWithoutPassword> {
    const user = await this.userService.findOne({ id: payload.id });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const refreshToken = this.extractRefresh(req);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const isValidToken = await this.tokenService.verifyRefreshToken(
      user.id,
      refreshToken,
    );
    if (!isValidToken) {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    return user;
  }

  private extractRefresh(req: Request): string | null {
    return req?.cookies?.refreshToken || null;
  }
}
