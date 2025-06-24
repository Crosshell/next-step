import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { UserWithoutPassword } from '../user/types/user-without-password.type';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async validateCredentials(loginDto: LoginDto): Promise<UserWithoutPassword> {
    const { email, password } = loginDto;
    const user = (await this.userService.findOne({ email }, false)) as User;

    const isValid = user && (await argon2.verify(user.password, password));
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async login(
    user: UserWithoutPassword,
    ua: string,
    ip: string,
  ): Promise<string> {
    return this.sessionService.createSession(user.id, ua, ip);
  }

  async register(
    registerDto: RegisterDto,
    ua: string,
    ip: string,
  ): Promise<string> {
    const existingUser = await this.userService.findOne({
      email: registerDto.email,
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const newUser = await this.userService.create(registerDto);
    return this.sessionService.createSession(newUser.id, ua, ip);
  }

  async logout(sid: string): Promise<void> {
    await this.sessionService.deleteSession(sid);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionService.deleteAllSessions(userId);
  }
}
