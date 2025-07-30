import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { UserWithoutPassword } from './types/user-without-password.type';
import { BadRequestException } from '@nestjs/common';

jest.mock('argon2');
const mockedArgon2 = argon2 as jest.Mocked<typeof argon2>;

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  // const mockUser: User = {
  //   id: '123e4567-e89b-12d3-a456-426614174000',
  //   email: 'test@example.com',
  //   password: 'hashedPassword',
  //   type: 'COMPANY',
  //   isEmailVerified: false,
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // };

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
});
