import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CookieService } from '../cookie.service';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );
    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } =
      await this.authService.register(createUserDto);
    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  async refresh(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );
    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }
}
