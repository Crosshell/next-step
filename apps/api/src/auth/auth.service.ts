import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenType } from '@prisma/client';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { TokenService } from '../token/token.service';
import { RegisterDto } from './dto/register.dto';
import { UserWithoutPassword } from '../user/types/user-without-password.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async login(user: UserWithoutPassword): Promise<JwtTokensDto> {
    const { id, email, type } = user;
    return this.tokenService.generateAndSaveTokens({ id, email, type });
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
