import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserWithoutPassword } from '../../user/types/user-without-password.type';
import { RequestWithUser } from '../types/request-with-user';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserWithoutPassword => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
