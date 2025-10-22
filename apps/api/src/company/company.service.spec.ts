import { CompanyRepository } from './company.repository';
import { ConfigService } from '@nestjs/config';
import { CompanyService } from './company.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company, Prisma } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createPaginationMeta, getPaginationByPage } from '@common/utils';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';

jest.mock('@common/utils', () => ({
  getPaginationByPage: jest.fn(),
  createPaginationMeta: jest.fn(),
}));

const mockedGetPaginationByPage = getPaginationByPage as jest.MockedFunction<
  typeof getPaginationByPage
>;

const mockedCreatePaginationMeta = createPaginationMeta as jest.MockedFunction<
  typeof createPaginationMeta
>;

describe('CompanyService', () => {
  let service: CompanyService;
  let repository: jest.Mocked<CompanyRepository>;

  const pageSize = 10;

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
      count: jest.fn(),
    };

    const mockConfigService = {
      getOrThrow: jest.fn(),
    };

    mockConfigService.getOrThrow.mockReturnValue(pageSize);

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

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

  describe('findOneOrThrow', () => {
    const where: Prisma.CompanyWhereUniqueInput = {
      id: '123e4567-e89b-12d3-a456-426614174001',
    };

    it('should return company', async () => {
      repository.findOne.mockResolvedValue(mockCompany);

      const result = await service.findOneOrThrow(where);

      expect(repository.findOne).toHaveBeenCalledWith(where);
      expect(result).toEqual(mockCompany);
    });

    it('should throw NotFoundException if company does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneOrThrow(where)).rejects.toThrow(
        new NotFoundException('Company not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith(where);
    });
  });

  describe('assertNotExists', () => {
    const where: Prisma.CompanyWhereUniqueInput = {
      id: '123e4567-e89b-12d3-a456-426614174001',
    };

    it('should not throw if company does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.assertNotExists(where);

      expect(repository.findOne).toHaveBeenCalledWith(where);
      expect(result).toBeUndefined();
    });

    it('should throw BadRequestException if company exists', async () => {
      repository.findOne.mockResolvedValue(mockCompany);

      await expect(service.assertNotExists(where)).rejects.toThrow(
        new BadRequestException('Company already exists'),
      );

      expect(repository.findOne).toHaveBeenCalledWith(where);
    });
  });

  describe('search', () => {
    const dto: SearchCompanyDto = {
      name: 'Company',
      page: 2,
    };
    const total = 11;
    const pagination = { skip: pageSize, take: pageSize };
    const meta = { total, page: dto.page, totalPages: 10 };
    const where: Prisma.CompanyWhereInput = {
      name: { contains: dto.name, mode: 'insensitive' },
    };

    it('should return companies', async () => {
      mockedGetPaginationByPage.mockReturnValue(pagination);
      repository.findMany.mockResolvedValue([mockCompany]);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.search(dto);

      expect(mockedGetPaginationByPage).toHaveBeenCalledWith(
        dto.page,
        pageSize,
      );
      expect(repository.findMany).toHaveBeenCalledWith({
        where,
        ...pagination,
      });
      expect(repository.count).toHaveBeenCalledWith(where);
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        total,
        dto.page,
        pageSize,
      );
      expect(result).toEqual({ data: [mockCompany], meta });
    });

    it('should search without name filter', async () => {
      const dtoWithoutName: SearchCompanyDto = {
        page: 3,
      };
      const meta = { total, page: dtoWithoutName.page, totalPages: 10 };
      const whereWithoutName: Prisma.CompanyWhereInput = {};

      mockedGetPaginationByPage.mockReturnValue(pagination);
      repository.findMany.mockResolvedValue([mockCompany]);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.search(dtoWithoutName);

      expect(mockedGetPaginationByPage).toHaveBeenCalledWith(
        dtoWithoutName.page,
        pageSize,
      );
      expect(repository.findMany).toHaveBeenCalledWith({
        where: whereWithoutName,
        ...pagination,
      });
      expect(repository.count).toHaveBeenCalledWith(whereWithoutName);
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        total,
        dtoWithoutName.page,
        pageSize,
      );
      expect(result).toEqual({ data: [mockCompany], meta });
    });
  });

  describe('update', () => {
    const id: string = '123e4567-e89b-12d3-a456-426614174001';
    const dto: UpdateCompanyDto = {
      name: 'Company',
      description: 'Description',
      url: 'https://example.com',
      logoUrl: 'https://example.com/logo.png',
    };

    it('should update a company', async () => {
      repository.update.mockResolvedValue(mockCompany);

      const result = await service.update(id, dto);

      expect(repository.update).toHaveBeenCalledWith({ id }, dto);
      expect(result).toEqual(mockCompany);
    });
  });
});
