import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export class UserSwagger {
  static create() {
    return applyDecorators(
      ApiOperation({ summary: 'Create a new user' }),
      ApiResponse({ status: 201, description: 'Created user' }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
    );
  }

  static findAll() {
    return applyDecorators(
      ApiOperation({ summary: 'Get all users' }),
      ApiResponse({ status: 200, description: 'List of users' }),
    );
  }

  static findById() {
    return applyDecorators(
      ApiOperation({ summary: 'Get user by id' }),
      ApiResponse({ status: 200, description: 'User details' }),
      ApiResponse({ status: 400, description: 'Invalid uuid format' }),
      ApiResponse({ status: 404, description: 'User not found' }),
    );
  }

  static update() {
    return applyDecorators(
      ApiOperation({ summary: 'Update user by id' }),
      ApiResponse({ status: 200, description: 'Updated user' }),
      ApiResponse({ status: 400, description: 'Invalid uuid format or input' }),
      ApiResponse({ status: 404, description: 'User not found' }),
    );
  }

  static remove() {
    return applyDecorators(
      ApiOperation({ summary: 'Delete user by id' }),
      ApiResponse({ status: 200, description: 'Deleted user' }),
      ApiResponse({ status: 400, description: 'Invalid uuid format' }),
      ApiResponse({ status: 404, description: 'User not found' }),
    );
  }
}
