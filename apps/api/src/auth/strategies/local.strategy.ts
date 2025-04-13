import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { UserService } from '../../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findByEmail(email);
    const isValid = user && (await argon2.verify(user.password, password));

    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
