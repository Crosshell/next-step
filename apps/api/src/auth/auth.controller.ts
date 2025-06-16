import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserWithoutPassword } from '../user/types/user-without-password.type';
import { AuthSwagger } from '../../docs/swagger/auth.swagger';
import { CookieConfig } from '../config/cookie.config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieConfig: CookieConfig,
  ) {}

  @AuthSwagger.login()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: UserWithoutPassword,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(user);
    res.cookie(
      'refreshToken',
      refreshToken,
      this.cookieConfig.refreshTokenOptions,
    );
    return { accessToken };
  }

  @AuthSwagger.register()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } =
      await this.authService.register(registerDto);
    res.cookie(
      'refreshToken',
      refreshToken,
      this.cookieConfig.refreshTokenOptions,
    );
    return { accessToken };
  }

  @AuthSwagger.refresh()
  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  async refresh(
    @CurrentUser() user: UserWithoutPassword,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(user);
    res.cookie(
      'refreshToken',
      refreshToken,
      this.cookieConfig.refreshTokenOptions,
    );
    return { accessToken };
  }

  @AuthSwagger.logout()
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: UserWithoutPassword,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    await this.authService.logout(user.id);
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }
}
