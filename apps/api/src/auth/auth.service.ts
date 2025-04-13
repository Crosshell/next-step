import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenType } from '@prisma/client';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async login(jwtPayloadDto: JwtPayloadDto): Promise<JwtTokensDto> {
    const { id, email, type } = jwtPayloadDto;
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({ id, email, type });
    await this.tokenService.upsertToken(id, TokenType.REFRESH, refreshToken);
    return { accessToken, refreshToken };
  }

  async register(createUserDto: CreateUserDto): Promise<JwtTokensDto> {
    const user = await this.userService.findByEmail(createUserDto.email);

    if (user) {
      throw new BadRequestException('User with this email already exists');
    }

    const newUser = await this.userService.create(createUserDto);
    const { id, email, type } = newUser;

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({ id, email, type });
    await this.tokenService.upsertToken(id, TokenType.REFRESH, refreshToken);
    return { accessToken, refreshToken };
  }

  async logout(id: string): Promise<void> {
    await this.tokenService.deleteToken(id, TokenType.REFRESH);
  }
}
