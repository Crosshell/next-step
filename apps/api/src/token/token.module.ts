import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtConfig } from '../config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

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
    PrismaModule,
  ],
  providers: [TokenService, JwtConfig],
  exports: [TokenService],
})
export class TokenModule {}
