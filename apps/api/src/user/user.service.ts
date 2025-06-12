import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithoutPassword } from './types/user-without-password.type';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const hashedPassword = await argon2.hash(createUserDto.password);

    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      omit: { password: true },
    });
  }

  async findOne(
    where: Prisma.UserWhereUniqueInput,
    excludePassword: boolean = true,
  ): Promise<User | UserWithoutPassword | null> {
    return this.prismaService.user.findUnique({
      where,
      omit: {
        password: excludePassword,
      },
    });
  }
}
