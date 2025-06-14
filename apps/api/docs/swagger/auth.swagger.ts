import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { RegisterDto } from '../../src/auth/dto/register.dto';

export class AuthSwagger {
  static login() {
    return applyDecorators(
      ApiOperation({ summary: 'User login' }),
      ApiBody({
        description: 'User credentials',
        type: LoginDto,
      }),
      ApiResponse({
        status: 200,
        description: 'Login successful',
        schema: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
          },
        },
      }),
      ApiResponse({
        status: 401,
        description: 'Invalid credentials',
      }),
    );
  }

  static register() {
    return applyDecorators(
      ApiOperation({ summary: 'User registration' }),
      ApiBody({ description: 'User registration data', type: RegisterDto }),
      ApiResponse({
        status: 201,
        description: 'Registration successful',
        schema: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
          },
        },
      }),
      ApiResponse({
        status: 400,
        description: 'User with this email already exists',
      }),
    );
  }

  static refresh() {
    return applyDecorators(
      ApiOperation({ summary: 'Refresh access token' }),
      ApiCookieAuth(),
      ApiResponse({
        status: 200,
        description: 'Token refreshed successfully',
        schema: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
          },
        },
      }),
      ApiResponse({
        status: 400,
        description: 'User not found',
      }),
      ApiResponse({
        status: 401,
        description: 'Invalid or revoked refresh token',
      }),
    );
  }

  static logout() {
    return applyDecorators(
      ApiOperation({ summary: 'User logout' }),
      ApiBearerAuth(),
      ApiResponse({
        status: 200,
        description: 'Logout successful',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Logged out successfully' },
          },
        },
      }),
      ApiResponse({ status: 401, description: 'Unauthorized' }),
    );
  }
}
