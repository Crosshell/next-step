import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { RegisterDto } from '../../src/auth/dto/register.dto';
import { ResendVerificationDto } from '../../src/auth/dto/resend-verification.dto';
import { ForgotPasswordDto } from '../../src/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '../../src/auth/dto/reset-password.dto';

export class AuthSwagger {
  static login() {
    return applyDecorators(
      ApiOperation({ summary: 'User login' }),
      ApiBody({
        description: 'User credentials',
        type: LoginDto,
      }),
      ApiOkResponse({
        description: 'Login successful',
        schema: { type: 'object', properties: { message: { type: 'string' } } },
      }),
      ApiUnauthorizedResponse({
        description: 'Invalid credentials or email not verified',
      }),
    );
  }

  static register() {
    return applyDecorators(
      ApiOperation({
        summary: 'User registration. Confirmation link sent to email',
      }),
      ApiBody({ description: 'User registration data', type: RegisterDto }),
      ApiCreatedResponse({
        description: 'Registration successful. Confirmation link sent to email',
        schema: { type: 'object', properties: { message: { type: 'string' } } },
      }),
      ApiBadRequestResponse({ description: 'User already exists' }),
    );
  }

  static logout() {
    return applyDecorators(
      ApiOperation({ summary: 'User logout. Clears session cookie' }),
      ApiOkResponse({
        description: 'Logged out successfully',
        schema: { type: 'object', properties: { message: { type: 'string' } } },
      }),
      ...this.sessionAuthDecorators(),
    );
  }

  static logoutAll() {
    return applyDecorators(
      ApiOperation({
        summary: 'Logged out from all user devices. Clears all session cookie',
      }),
      ApiOkResponse({
        description: 'Logged out from all devices successfully',
        schema: { type: 'object', properties: { message: { type: 'string' } } },
      }),
      ...this.sessionAuthDecorators(),
    );
  }

  static verify() {
    return applyDecorators(
      ApiOperation({ summary: 'Verify email' }),
      ApiOkResponse({
        description: 'Email verified successfully',
        schema: { type: 'object', properties: { message: { type: 'string' } } },
      }),
      ApiUnauthorizedResponse({
        description: 'Invalid or expired verify token',
      }),
      ApiNotFoundResponse({ description: 'User not found' }),
    );
  }

  static verifyResend() {
    return applyDecorators(
      ApiOperation({ summary: 'Resend verify link' }),
      ApiBody({ type: ResendVerificationDto }),
      ApiOkResponse({
        description: 'Verification link sent',
        schema: { type: 'object', properties: { message: { type: 'string' } } },
      }),
      ApiNotFoundResponse({ description: 'User not found' }),
      ApiBadRequestResponse({ description: 'Email already verified' }),
    );
  }

  static forgotPassword() {
    return applyDecorators(
      ApiOperation({ summary: 'Send password reset link' }),
      ApiBody({ type: ForgotPasswordDto }),
      ApiOkResponse({
        description: 'Password reset link sent',
        schema: { type: 'object', properties: { message: { type: 'string' } } },
      }),
      ApiNotFoundResponse({ description: 'User not found' }),
    );
  }

  static resetPassword() {
    return applyDecorators(
      ApiOperation({ summary: 'Reset password' }),
      ApiBody({ type: ResetPasswordDto }),
      ApiOkResponse({
        description: 'Password reset successfully',
        schema: { type: 'object', properties: { message: { type: 'string' } } },
      }),
      ApiUnauthorizedResponse({
        description: 'Invalid or expired reset token',
      }),
      ApiNotFoundResponse({ description: 'User not found' }),
    );
  }

  static sessionAuthDecorators() {
    return [
      ApiCookieAuth('sid'),
      ApiNotFoundResponse({ description: 'Session or user not found' }),
      ApiUnauthorizedResponse({ description: 'Invalid or expired session' }),
    ];
  }
}
