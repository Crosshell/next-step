import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { JwtConfig } from '../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly jwtConfig: JwtConfig,
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

  async login(jwtPayloadDto: JwtPayloadDto): Promise<JwtTokensDto> {
    return this.generateTokens(jwtPayloadDto);
  }

  async register(createUserDto: CreateUserDto): Promise<JwtTokensDto> {
    const user = await this.userService.findByEmail(createUserDto.email);

    if (user) {
      throw new BadRequestException('User with this email already exists');
    }

    const newUser = await this.userService.create(createUserDto);
    const { id, email, userType } = newUser;
    return this.generateTokens({ id, email, userType });
  }

  private async generateTokens(payload: JwtPayloadDto): Promise<JwtTokensDto> {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }
}
