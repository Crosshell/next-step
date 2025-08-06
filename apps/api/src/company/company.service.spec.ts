import { CompanyRepository } from './company.repository';
import { ConfigService } from '@nestjs/config';
import { CompanyService } from './company.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { getPaginationByPage } from '@common/utils';

jest.mock('@common/utils');
const mockedGetPaginationByPage = getPaginationByPage as jest.Mocked<
  typeof getPaginationByPage
>;

describe('CompanyService', () => {
  let service: CompanyService;
  let repository: jest.Mocked<CompanyRepository>;
  let config: jest.Mocked<ConfigService>;

  const mockCompany: Company = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Company',
    description: 'Description',
    isVerified: false,
    url: 'https://example.com',
    logoUrl: 'https://example.com/logo.png',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockCompanyRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    };

    const mockConfigService = {
      getOrThrow: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
          useValue: mockCompanyRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    repository = module.get(CompanyRepository);
    config = module.get(ConfigService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId: string = '123e4567-e89b-12d3-a456-426614174001';
    const dto: CreateCompanyDto = {
      name: 'Company',
      description: 'Description',
      url: 'https://example.com',
      logoUrl: 'https://example.com/logo.png',
    };

    it('should create a company', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockCompany);

      const result = await service.create(userId, dto);

      expect(repository.findOne).toHaveBeenCalledWith({ userId });
      expect(repository.create).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(mockCompany);
    });

    it('should throw BadRequestException if company already exists', async () => {
      repository.findOne.mockResolvedValue(mockCompany);

      await expect(service.create(userId, dto)).rejects.toThrow(
        new BadRequestException('Company already exists'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({ userId });
      expect(repository.create).not.toHaveBeenCalled();
    });
  });
});
