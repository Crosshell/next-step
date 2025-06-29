import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { UserWithoutPassword } from './types/user-without-password.type';
import {
  SubjectNotFoundException,
  SubjectExistsException,
} from '@common/exceptions';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: Prisma.UserCreateInput): Promise<UserWithoutPassword> {
    const existingUser = await this.findOne({
      email: user.email,
    });

    if (existingUser) {
      throw new SubjectExistsException('User');
    }

    const hashedPassword = await argon2.hash(user.password);

    return this.prismaService.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
      omit: { password: true },
    });
  }

  async findOne(
    where: Prisma.UserWhereUniqueInput,
    excludePassword?: true,
  ): Promise<UserWithoutPassword | null>;

  async findOne(
    where: Prisma.UserWhereUniqueInput,
    excludePassword: false,
  ): Promise<User | null>;

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

  async deleteMany(where: Prisma.UserWhereInput): Promise<Prisma.BatchPayload> {
    return this.prismaService.user.deleteMany({ where });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<UserWithoutPassword> {
    const existingUser = await this.findOne(where);

    if (!existingUser) {
      throw new SubjectNotFoundException('User');
    }

    const hashedPassword =
      data.password && (await argon2.hash(data.password as string));

    return this.prismaService.user.update({
      where,
      data: {
        ...data,
        password: hashedPassword,
      },
      omit: { password: true },
    });
  }
}
