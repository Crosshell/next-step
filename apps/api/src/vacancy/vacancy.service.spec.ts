import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyRepository } from './vacancy.repository';
import { LanguageService } from '../language/language.service';
import { SkillService } from '../skill/skill.service';
import { VacancySearchService } from './vacancy-search.service';
import { CompanyService } from '../company/company.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { SearchVacancyDto } from './dto/search-vacancy.dto';
import { SetLanguagesDto } from './dto/set-languages.dto';
import { SetSkillsDto } from './dto/set-skills.dto';
import {
  Vacancy,
  Prisma,
  SeniorityLevel,
  Company,
  WorkFormat,
  EmploymentType,
  LanguageLevel,
} from '@prisma/client';

describe('VacancyService', () => {
  let service: VacancyService;
  let vacancyRepository: jest.Mocked<VacancyRepository>;
  let languageService: jest.Mocked<LanguageService>;
  let skillService: jest.Mocked<SkillService>;
  let searchService: jest.Mocked<VacancySearchService>;
  let companyService: jest.Mocked<CompanyService>;

  const mockVacancy: Vacancy = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    companyId: '123e4567-e89b-12d3-a456-426614174002',
    title: 'Software Engineer',
    description: 'Job description',
    salaryMin: 100,
    salaryMax: 500,
    officeLocation: 'London',
    experienceRequired: 2,
    isActive: true,
    seniorityLevel: SeniorityLevel.MIDDLE,
    workFormat: [WorkFormat.REMOTE, WorkFormat.OFFICE],
    employmentType: [EmploymentType.CONTRACT, EmploymentType.PART_TIME],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCompany: Company = {
    id: '123e4567-e89b-12d3-a456-426614174003',
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
    const mockVacancyRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      setRequiredSkills: jest.fn(),
      setRequiredLanguages: jest.fn(),
    };

    const mockLanguageService = {
      assertExists: jest.fn(),
    };

    const mockSkillService = {
      assertExists: jest.fn(),
    };

    const mockSearchService = {
      search: jest.fn(),
    };

    const mockCompanyService = {
      findOneOrThrow: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacancyService,
        {
          provide: VacancyRepository,
          useValue: mockVacancyRepository,
        },
        {
          provide: LanguageService,
          useValue: mockLanguageService,
        },
        {
          provide: SkillService,
          useValue: mockSkillService,
        },
        {
          provide: VacancySearchService,
          useValue: mockSearchService,
        },
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
      ],
    }).compile();

    service = module.get<VacancyService>(VacancyService);
    vacancyRepository = module.get(VacancyRepository);
    languageService = module.get(LanguageService);
    skillService = module.get(SkillService);
    searchService = module.get(VacancySearchService);
    companyService = module.get(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const companyId: string = '123e4567-e89b-12d3-a456-426614174002';
    const dto: CreateVacancyDto = {
      title: 'Software Engineer',
      description: 'Job description',
      salaryMin: 100,
      salaryMax: 500,
      officeLocation: 'London',
      experienceRequired: 2,
      isActive: true,
      seniorityLevel: SeniorityLevel.MIDDLE,
      workFormat: [WorkFormat.REMOTE, WorkFormat.OFFICE],
      employmentType: [EmploymentType.CONTRACT, EmploymentType.PART_TIME],
    };

    it('should create a vacancy', async () => {
      vacancyRepository.create.mockResolvedValue(mockVacancy);

      const result = await service.create(companyId, dto);

      expect(vacancyRepository.create).toHaveBeenCalledWith(
        companyId,
        dto,
        true,
      );
      expect(result).toEqual(mockVacancy);
    });
  });

  describe('findOneOrThrow', () => {
    const where: Prisma.VacancyWhereUniqueInput = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    };

    it('should return a vacancy', async () => {
      vacancyRepository.findOne.mockResolvedValue(mockVacancy);

      const result = await service.findOneOrThrow(where);

      expect(vacancyRepository.findOne).toHaveBeenCalledWith(where, true);
      expect(result).toEqual(mockVacancy);
    });

    it('should throw NotFoundException when vacancy not found', async () => {
      vacancyRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneOrThrow(where)).rejects.toThrow(
        new NotFoundException('Vacancy not found'),
      );

      expect(vacancyRepository.findOne).toHaveBeenCalledWith(where, true);
    });
  });

  describe('searchByCompanyId', () => {
    const companyId = '123e4567-e89b-12d3-a456-426614174001';
    const vacancies = [mockVacancy];
    const dto: SearchVacancyDto = {
      page: 1,
    };
    const meta = { total: 1, page: 1, totalPages: 1 };

    it('should return vacancies for valid company', async () => {
      searchService.search.mockResolvedValue({
        data: vacancies,
        meta,
      });
      companyService.findOneOrThrow.mockResolvedValue(mockCompany);

      const result = await service.searchByCompanyId(companyId, dto);

      expect(companyService.findOneOrThrow).toHaveBeenCalledWith({
        id: companyId,
      });
      expect(searchService.search).toHaveBeenCalledWith(dto, {
        companyId,
      });
      expect(result).toEqual({
        data: vacancies,
        meta,
      });
    });
  });

  describe('search', () => {
    const dto: SearchVacancyDto = {
      title: 'Title',
      page: 1,
    };
    const vacancies = [mockVacancy];
    const meta = { total: 1, page: 1, totalPages: 1 };

    it('should return search results', async () => {
      searchService.search.mockResolvedValue({ meta, data: vacancies });

      const result = await service.search(dto);

      expect(searchService.search).toHaveBeenCalledWith(dto, undefined);
      expect(result).toEqual({ meta, data: vacancies });
    });
  });

  describe('update', () => {
    const where: Prisma.VacancyWhereUniqueInput = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    };
    const dto: UpdateVacancyDto = {
      title: 'Updated Title',
    };

    it('should update a vacancy', async () => {
      vacancyRepository.update.mockResolvedValue(mockVacancy);

      const result = await service.update(where, dto);

      expect(vacancyRepository.update).toHaveBeenCalledWith(where, dto, true);
      expect(result).toEqual(mockVacancy);
    });
  });

  describe('delete', () => {
    const where: Prisma.VacancyWhereUniqueInput = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    };

    it('should delete a vacancy', async () => {
      vacancyRepository.delete.mockResolvedValue(mockVacancy);

      const result = await service.delete(where);

      expect(vacancyRepository.delete).toHaveBeenCalledWith(where);
      expect(result).toEqual(mockVacancy);
    });
  });

  describe('setRequiredSkills', () => {
    const vacancyId = 'vacancy-1';
    const setSkillsDto: SetSkillsDto = {
      requiredSkillIds: [
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174002',
      ],
    };
    const skills = [
      { skillId: '123e4567-e89b-12d3-a456-426614174001' },
      { skillId: '123e4567-e89b-12d3-a456-426614174002' },
    ];

    it('should set required skills for a vacancy', async () => {
      skillService.assertExists.mockResolvedValue(undefined);
      vacancyRepository.setRequiredSkills.mockResolvedValue(mockVacancy);

      const result = await service.setRequiredSkills(vacancyId, setSkillsDto);

      expect(skillService.assertExists).toHaveBeenCalledWith(
        setSkillsDto.requiredSkillIds,
      );
      expect(vacancyRepository.setRequiredSkills).toHaveBeenCalledWith(
        vacancyId,
        skills,
        true,
      );
      expect(result).toEqual(mockVacancy);
    });
  });

  describe('setRequiredLanguages', () => {
    const vacancyId = 'vacancy-1';
    const setLanguagesDto: SetLanguagesDto = {
      requiredLanguages: [
        {
          languageId: '123e4567-e89b-12d3-a456-426614174001',
          level: LanguageLevel.INTERMEDIATE,
        },
        {
          languageId: '123e4567-e89b-12d3-a456-426614174002',
          level: LanguageLevel.ADVANCED,
        },
      ],
    };
    const languageIds = [
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
    ];

    it('should set required languages for a vacancy', async () => {
      languageService.assertExists.mockResolvedValue();
      vacancyRepository.setRequiredLanguages.mockResolvedValue(mockVacancy);

      const result = await service.setRequiredLanguages(
        vacancyId,
        setLanguagesDto,
      );

      expect(languageService.assertExists).toHaveBeenCalledWith(languageIds);
      expect(vacancyRepository.setRequiredLanguages).toHaveBeenCalledWith(
        vacancyId,
        setLanguagesDto.requiredLanguages,
        true,
      );
      expect(result).toEqual(mockVacancy);
    });
  });
});
