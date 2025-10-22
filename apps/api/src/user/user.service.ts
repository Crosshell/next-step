import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { UserWithoutPassword } from './types/user-without-password.type';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(user: Prisma.UserCreateInput): Promise<UserWithoutPassword> {
    await this.assertNotExists({ email: user.email });
    const hashedPassword = await argon2.hash(user.password);
    return this.repository.create(user, hashedPassword);
  }

  async deleteMany(where: Prisma.UserWhereInput): Promise<Prisma.BatchPayload> {
    return this.repository.deleteMany(where);
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Omit<Prisma.UserUpdateInput, 'type'>,
  ): Promise<UserWithoutPassword> {
    await this.findOneOrThrow(where);

    const hashedPassword =
      data.password && (await argon2.hash(data.password as string));

    return this.repository.update(where, { ...data, password: hashedPassword });
  }

  async findOneWithPassword(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.repository.findOneWithPassword(where);
  }

  async findOneOrThrow(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserWithoutPassword> {
    const user = await this.repository.findOne(where);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async assertNotExists(where: Prisma.UserWhereUniqueInput): Promise<void> {
    const user = await this.repository.findOne(where);
    if (user) throw new BadRequestException('User already exists');
  }
}
