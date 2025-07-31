import { LanguageService } from './language.service';
import { LanguageRepository } from './language.repository';
import { Language } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

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
});
