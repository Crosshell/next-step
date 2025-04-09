import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findByEmail(email);

    if (user && (await argon2.verify(user.password, password))) {
      const { password, ...safeUser } = user;
      return safeUser;
    }

    return null;
  }

  async login(jwtPayloadDto: JwtPayloadDto): Promise<string> {
    const { id, email } = jwtPayloadDto;
    return this.jwtService.signAsync({ id, email });
  }
}
