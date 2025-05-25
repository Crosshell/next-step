import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from './token.service';
import { JwtConfig } from '../config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow('jwt.secret'),
        signOptions: {
          expiresIn: configService.getOrThrow('jwt.accessExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenService, PrismaService, JwtConfig],
  exports: [TokenService],
})
export class TokenModule {}
