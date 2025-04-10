import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { JwtConfig } from '../../config/jwt.config';
import { User } from '@prisma/client';
import { UserService } from '../../user/user.service';

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

  async validate(payload: JwtPayloadDto): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findById(payload.id);
    if (!user) throw new UnauthorizedException();
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
