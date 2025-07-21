import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserWithoutPassword } from '../user/types/user-without-password.type';
import { SessionService } from './session.service';
import { Session } from './types/session-data.type';
import { SessionSwagger } from '../../docs/swagger/session.swagger';

@Controller('sessions')
export class SessionController {
  constructor(private readonly service: SessionService) {}

  @Get()
  @UseGuards(SessionAuthGuard)
  @SessionSwagger.getAllSessions()
  async getAllSessions(
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<Session[]> {
    return this.service.getUserSessions(user.id);
  }
}
