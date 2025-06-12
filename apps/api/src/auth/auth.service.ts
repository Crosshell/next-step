import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenType } from '@prisma/client';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { TokenService } from '../token/token.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async login(jwtPayloadDto: JwtPayloadDto): Promise<JwtTokensDto> {
    return this.tokenService.generateAndSaveTokens(jwtPayloadDto);
  }

  async register(registerDto: RegisterDto): Promise<JwtTokensDto> {
    const user = await this.userService.findOne({ email: registerDto.email });
    if (user) {
      throw new BadRequestException('User with this email already exists');
    }

    const newUser = await this.userService.create(registerDto);
    const { id, email, type } = newUser;

    return this.tokenService.generateAndSaveTokens({ id, email, type });
  }

  async logout(id: string): Promise<void> {
    await this.tokenService.deleteToken(id, TokenType.REFRESH);
  }
}
