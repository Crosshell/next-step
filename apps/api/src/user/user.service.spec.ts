import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { Prisma, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { UserWithoutPassword } from './types/user-without-password.type';
import { BadRequestException } from '@nestjs/common';

jest.mock('argon2');
const mockedArgon2 = argon2 as jest.Mocked<typeof argon2>;

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: 'hashedPassword',
    type: 'COMPANY',
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword: UserWithoutPassword = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    type: 'COMPANY',
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      deleteMany: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);

    jest.clearAllMocks();
    mockedArgon2.hash.mockClear();
  });

  describe('create', () => {
    const user: Prisma.UserCreateInput = {
      email: 'test@example.com',
      password: 'plainPassword',
      type: 'COMPANY',
    };

    it('should create a user', async () => {
      const hashedPassword = 'hashedPassword123';

      repository.findOne.mockResolvedValue(null);
      mockedArgon2.hash.mockResolvedValue(hashedPassword);
      repository.create.mockResolvedValue(mockUserWithoutPassword);

      const result = await service.create(user);

      expect(repository.findOne).toHaveBeenCalledWith({ email: user.email });
      expect(mockedArgon2.hash).toHaveBeenCalledWith(user.password);
      expect(repository.create).toHaveBeenCalledWith(user, hashedPassword);
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should throw BadRequestException if user already exists', async () => {
      repository.findOne.mockResolvedValue(mockUserWithoutPassword);

      await expect(service.create(user)).rejects.toThrow(
        new BadRequestException('User already exists'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({ email: user.email });
      expect(mockedArgon2.hash).not.toHaveBeenCalled();
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('deleteMany', () => {
    const where: Prisma.UserWhereInput = {
      isEmailVerified: false,
    };
    const batchPayload: Prisma.BatchPayload = { count: 5 };

    it('should delete users', async () => {
      repository.deleteMany.mockResolvedValue(batchPayload);

      const result = await service.deleteMany(where);

      expect(repository.deleteMany).toHaveBeenCalledWith(where);
      expect(result).toEqual(batchPayload);
    });
  });

  describe('update', () => {
    const where: Prisma.UserWhereUniqueInput = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const data: Omit<Prisma.UserUpdateInput, 'type'> = {
      password: 'plainPassword',
      isEmailVerified: true,
    };

    it('should update a user', async () => {
      const hashedPassword = 'hashedPassword123';

      repository.findOne.mockResolvedValue(mockUserWithoutPassword);
      mockedArgon2.hash.mockResolvedValue(hashedPassword);
      repository.update.mockResolvedValue(mockUserWithoutPassword);

      const result = await service.update(where, data);

      expect(repository.findOne).toHaveBeenCalledWith(where);
      expect(mockedArgon2.hash).toHaveBeenCalledWith(data.password);
      expect(repository.update).toHaveBeenCalledWith(where, {
        ...data,
        password: hashedPassword,
      });
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should not update password if not provided', async () => {
      repository.findOne.mockResolvedValue(mockUserWithoutPassword);
      repository.update.mockResolvedValue(mockUserWithoutPassword);

      const result = await service.update(where, { isEmailVerified: true });

      expect(repository.findOne).toHaveBeenCalledWith(where);
      expect(mockedArgon2.hash).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith(where, {
        isEmailVerified: true,
      });
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should throw BadRequestException if user does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(where, data)).rejects.toThrow(
        new BadRequestException('User not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith(where);
      expect(mockedArgon2.hash).not.toHaveBeenCalled();
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const where: Prisma.UserWhereUniqueInput = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    };

    it('should find user without password', async () => {
      repository.findOne.mockResolvedValue(mockUserWithoutPassword);

      const result = await service.findOne(where);

      expect(repository.findOne).toHaveBeenCalledWith(where, true);
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should find user with password', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(where, false);

      expect(repository.findOne).toHaveBeenCalledWith(where, false);
      expect(result).toEqual(mockUser);
    });
  });
});
