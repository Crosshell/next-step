import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { TokenModule } from '../token/token.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [UserModule, SessionModule, TokenModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, SessionAuthGuard],
  exports: [SessionAuthGuard, SessionModule, UserModule],
})
export class AuthModule {}
