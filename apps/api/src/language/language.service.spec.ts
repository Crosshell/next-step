import { LanguageService } from './language.service';
import { LanguageRepository } from './language.repository';
import { Language } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';

describe('LanguageService', () => {
  let service: LanguageService;
  let repository: jest.Mocked<LanguageRepository>;

  const mockLanguage: Language = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'English',
  };

  beforeEach(async () => {
    const mockLanguageRepository = {
      count: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageService,
        {
          provide: LanguageRepository,
          useValue: mockLanguageRepository,
        },
      ],
    }).compile();

    service = module.get<LanguageService>(LanguageService);
    repository = module.get(LanguageRepository);

    jest.clearAllMocks();
  });

  describe('assertExists', () => {
    const languageIds = [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
    ];

    it('should not throw error if all languages are found', async () => {
      repository.count.mockResolvedValue(languageIds.length);

      const result = await service.assertExists(languageIds);

      expect(repository.count).toHaveBeenCalledWith({
        id: { in: languageIds },
      });
      expect(result).toBeUndefined();
    });

    it('should throw error if not all languages are found', async () => {
      repository.count.mockResolvedValue(languageIds.length - 1);

      await expect(service.assertExists(languageIds)).rejects.toThrow(
        new BadRequestException('Language not found'),
      );

      expect(repository.count).toHaveBeenCalledWith({
        id: { in: languageIds },
      });
    });
  });

  describe('create', () => {
    const dto: CreateLanguageDto = {
      name: 'English',
    };

    it('should create a language', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockLanguage);

      const result = await service.create(dto);

      expect(repository.findOne).toHaveBeenCalledWith({ name: dto.name });
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockLanguage);
    });

    it('should throw BadRequestException if language already exists', async () => {
      repository.findOne.mockResolvedValue(mockLanguage);

      await expect(service.create(dto)).rejects.toThrow(
        new BadRequestException('Language already exists'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({ name: dto.name });
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all languages', async () => {
      repository.findAll.mockResolvedValue([mockLanguage, mockLanguage]);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockLanguage, mockLanguage]);
    });
  });
});
