import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthSwagger } from './auth.swagger';

export class SessionSwagger {
  static getAllSessions() {
    return applyDecorators(
      ApiOperation({ summary: 'Get all user sessions' }),
      ApiOkResponse({ description: 'Returns all user sessions' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }
}
