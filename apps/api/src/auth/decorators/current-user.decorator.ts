import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserWithoutPassword } from '../../user/types/user-without-password.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserWithoutPassword =>
    context.switchToHttp().getRequest().user,
);
