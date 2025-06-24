import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SessionId } from './decorators/session-id.decorator';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserWithoutPassword } from '../user/types/user-without-password.type';
import { UserAgent } from './decorators/user-agent.decorator';

@Controller('auth')
export class AuthController {
  private readonly cookieOptions: CookieOptions;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.cookieOptions = this.configService.getOrThrow('cookie');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() ua: string,
    @Ip() ip: string,
  ): Promise<{ message: string }> {
    const user = await this.authService.validateCredentials(loginDto);
    const sid = await this.authService.login(user, ua, ip);
    res.cookie('sid', sid, this.cookieOptions);
    return { message: 'Login successful' };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() ua: string,
    @Ip() ip: string,
  ): Promise<{ message: string }> {
    const sid = await this.authService.register(registerDto, ua, ip);
    res.cookie('sid', sid, this.cookieOptions);
    return { message: 'Registration successful' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard)
  async logout(
    @SessionId() sid: string,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<{ message: string }> {
    await this.authService.logout(sid);
    res.clearCookie('sid');
    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard)
  async logoutAll(
    @CurrentUser() user: UserWithoutPassword,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    await this.authService.logoutAll(user.id);
    res.clearCookie('sid');
    return { message: 'Logged out from all devices successfully' };
  }
}
