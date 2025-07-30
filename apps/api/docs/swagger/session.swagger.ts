import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthSwagger } from './auth.swagger';

export class SessionSwagger {
  static sessionOkResponseExample = {
    sid: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
    userId: 'e4b51ce7-c263-4a64-97e0-61461821740f',
    ua: 'PostmanRuntime/7.44.1',
    ip: '::1',
  };

  static sessionOkResponseSchema = {
    type: 'object',
    properties: {
      sid: {
        type: 'string',
        example: this.sessionOkResponseExample.sid,
      },
      userId: {
        type: 'string',
        example: this.sessionOkResponseExample.userId,
      },
      ua: {
        type: 'string',
        example: this.sessionOkResponseExample.ua,
      },
      ip: {
        type: 'string',
        example: this.sessionOkResponseExample.ip,
      },
    },
  };

  static getAllSessions() {
    return applyDecorators(
      ApiOperation({ summary: 'Get all user sessions' }),
      ApiOkResponse({
        description: 'Returns all user sessions',
        schema: this.sessionOkResponseSchema,
        example: this.sessionOkResponseExample,
      }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }
}
