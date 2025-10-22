import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithoutPassword } from './types/user-without-password.type';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.UserCreateInput,
    hashedPassword: string,
  ): Promise<UserWithoutPassword> {
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      omit: { password: true },
    });
  }

  async findOneWithPassword(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where });
  }

  async findOne(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserWithoutPassword | null> {
    return this.prisma.user.findUnique({
      where,
      omit: { password: true },
    });
  }

  async deleteMany(where: Prisma.UserWhereInput): Promise<Prisma.BatchPayload> {
    return this.prisma.user.deleteMany({ where });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<UserWithoutPassword> {
    return this.prisma.user.update({
      where,
      data,
      omit: { password: true },
    });
  }
}
