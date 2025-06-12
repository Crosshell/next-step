import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { JwtConfig } from '../../config/jwt.config';
import { UserService } from '../../user/user.service';
import { UserWithoutPassword } from '../../user/types/user-without-password.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtConfig: JwtConfig,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<UserWithoutPassword> {
    const user = await this.userService.findOne({ id: payload.id });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
