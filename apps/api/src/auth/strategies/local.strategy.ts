import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserService } from '../../user/user.service';
import { UserWithoutPassword } from '../../user/types/user-without-password.type';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    const user = (await this.userService.findOne({ email }, false)) as User;
    const isValid = user && (await argon2.verify(user.password, password));

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
