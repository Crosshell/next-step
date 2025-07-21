import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { SessionService } from '../../session/session.service';
import { RequestWithUser } from '../types/request-with-user.type';
import {
  SubjectNotFoundException,
  InvalidOrExpiredSubjectException,
} from '@common/exceptions';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const sessionId = this.extractSessionId(request);

    const session = await this.sessionService.getSession(sessionId);
    if (!session) {
      throw new InvalidOrExpiredSubjectException('session');
    }

    const user = await this.userService.findOneOrThrow({ id: session.userId });

    await this.sessionService.refreshSessionTTL(session.userId, sessionId);

    request.user = user;
    return true;
  }

  private extractSessionId(request: RequestWithUser): string {
    const sessionId = request.cookies?.sid;
    if (!sessionId) {
      throw new SubjectNotFoundException('Session id');
    }
    return sessionId;
  }
}
