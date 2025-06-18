import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthSwagger } from '../../docs/swagger/auth.swagger';
import { LoginDto } from './dto/login.dto';
import { CurrentSessionId } from './decorators/current-session';
import { AuthGuard } from './guards/auth-guard.service';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserWithoutPassword } from '../user/types/user-without-password.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @AuthSwagger.login()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const user = await this.authService.validateCredentials(loginDto);
    const sid = await this.authService.login(user);
    res.cookie('sid', sid, this.configService.getOrThrow('cookie'));
    return { message: 'Login successful' };
  }

  @AuthSwagger.register()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const sid = await this.authService.register(registerDto);
    res.cookie('sid', sid, this.configService.getOrThrow('cookie'));
    return { message: 'Registration successful' };
  }

  @AuthSwagger.logout()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async logout(
    @CurrentSessionId() sid: string,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<{ message: string }> {
    await this.authService.logout(sid);
    res.clearCookie('sid');
    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async logoutAll(
    @CurrentUser() user: UserWithoutPassword,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    await this.authService.logoutAll(user.id);
    res.clearCookie('sid');
    return { message: 'Logged out from all devices successfully' };
  }
}
