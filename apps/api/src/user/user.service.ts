import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await argon2.hash(createUserDto.password);

    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const data = { ...updateUserDto };
    if (data.password) {
      data.password = await argon2.hash(data.password);
    }

    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
