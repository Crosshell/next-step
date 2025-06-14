import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CookieService } from '../cookie/cookie.service';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserWithoutPassword } from '../user/types/user-without-password.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: UserWithoutPassword,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(user);
    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } =
      await this.authService.register(registerDto);
    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  async refresh(
    @CurrentUser() user: UserWithoutPassword,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(user);
    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<{ message: string }> {
    await this.authService.logout(user.id);
    return { message: 'Logged out successfully' };
  }
}
