import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TokenType, Token } from '@prisma/client';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';
import { JwtTokensDto } from '../auth/dto/jwt-tokens.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '../config/jwt.config';

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly jwtConfig: JwtConfig,
  ) {}

  async upsertToken(
    userId: string,
    type: TokenType,
    value: string,
  ): Promise<void> {
    await this.prismaService.token.upsert({
      where: { userId_type: { userId, type } },
      update: { value },
      create: { userId, type, value },
    });
  }

  async generateTokens(payload: JwtPayloadDto): Promise<JwtTokensDto> {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async findToken(userId: string, type: TokenType): Promise<Token | null> {
    return this.prismaService.token.findUnique({
      where: { userId_type: { userId, type } },
    });
  }
}
