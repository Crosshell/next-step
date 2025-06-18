import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { SessionService } from '../../session/session.service';
import { RequestWithUser } from '../types/request-with-user.type';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const sessionId = this.extractSessionId(request);

    const sessionData = await this.sessionService.getSessionData(sessionId);
    if (!sessionData) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const user = await this.userService.findOne({ id: sessionData.userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = user;
    return true;
  }

  private extractSessionId(request: RequestWithUser): string {
    const sessionId = request.cookies?.sid;
    if (!sessionId) {
      throw new UnauthorizedException('No session id found');
    }
    return sessionId;
  }
}
