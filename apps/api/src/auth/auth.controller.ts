import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
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
import { MessageResponse } from '@common/responses';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { AuthSwagger } from '../../docs/swagger/auth.swagger';

@Controller('auth')
export class AuthController {
  private readonly cookieOptions: CookieOptions;

  constructor(
    private readonly service: AuthService,
    private readonly config: ConfigService,
  ) {
    this.cookieOptions = this.config.getOrThrow('cookie');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.login()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() ua: string,
    @Ip() ip: string,
  ): Promise<MessageResponse> {
    const user = await this.service.validateCredentials(dto);
    const sid = await this.service.login(user, ua, ip);
    res.cookie('sid', sid, this.cookieOptions);
    return { message: 'Login successful' };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @AuthSwagger.register()
  async register(@Body() dto: RegisterDto): Promise<MessageResponse> {
    await this.service.register(dto);
    return {
      message: 'Registration successful. Verify your email address',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard)
  @AuthSwagger.logout()
  async logout(
    @SessionId() sid: string,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<MessageResponse> {
    await this.service.logout(sid);
    res.clearCookie('sid');
    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard)
  @AuthSwagger.logoutAll()
  async logoutAll(
    @CurrentUser() user: UserWithoutPassword,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResponse> {
    await this.service.logoutAll(user.id);
    res.clearCookie('sid');
    return { message: 'Logged out from all devices successfully' };
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.verify()
  async verifyEmail(@Query('token') token: string): Promise<MessageResponse> {
    await this.service.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }

  @Post('verify/resend')
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.verifyResend()
  async resendVerification(
    @Body() dto: ResendVerificationDto,
  ): Promise<MessageResponse> {
    await this.service.resendVerification(dto);
    return { message: 'Verification link sent' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.forgotPassword()
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<MessageResponse> {
    await this.service.forgotPassword(dto);
    return { message: 'Password reset link sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.resetPassword()
  async resetPassword(
    @Query('token') token: string,
    @Body() dto: ResetPasswordDto,
  ): Promise<MessageResponse> {
    await this.service.resetPassword(token, dto);
    return { message: 'Password reset successfully' };
  }
}
