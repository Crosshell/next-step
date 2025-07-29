import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithSessionId } from '../types/request-with-session-id.type';

export const SessionId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<RequestWithSessionId>();
    return request.cookies?.sid;
  },
);
