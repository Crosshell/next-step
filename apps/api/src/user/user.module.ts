import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
