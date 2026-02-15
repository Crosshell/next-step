import { Test, TestingModule } from '@nestjs/testing';
import { VacancyService } from './vacancy.service';
import { VacancyRepository } from '../repositories/vacancy.repository';
import { LanguageService } from '../../language/services/language.service';
import { SkillService } from '../../skill/services/skill.service';
import { CompanyService } from '../../company/services/company.service';
import { NotFoundException } from '@nestjs/common';
import {
  Company,
  EmploymentType,
  LanguageLevel,
  Prisma,
  SeniorityLevel,
  WorkFormat,
} from '@prisma/client';
import { VacancyWithRelations } from '../types/vacancy-with-relations.type';
import { CreateVacancyDto } from '../dto/create-vacancy.dto';
import { FindManyVacanciesDto } from '../dto/find-many-vacancies.dto';
import { UpdateVacancyDto } from '../dto/update-vacancy.dto';
import { SetSkillsDto } from '../dto/set-skills.dto';
import { SetLanguagesDto } from '../dto/set-languages.dto';

describe('VacancyService', () => {
  let service: VacancyService;
  let repository: jest.Mocked<VacancyRepository>;
  let skillService: jest.Mocked<SkillService>;
  let languageService: jest.Mocked<LanguageService>;

  const mockVacancy: VacancyWithRelations = {
    id: 'vacancy-uuid-1',
    companyId: 'company-uuid-1',
    title: 'Senior NestJS Developer',
    description: 'Great job',
    salaryMin: 3000,
    salaryMax: 5000,
    experienceRequired: 3,
    officeLocation: 'London',
    seniorityLevel: SeniorityLevel.SENIOR,
    workFormat: [WorkFormat.REMOTE],
    employmentType: [EmploymentType.FULL_TIME],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    company: {
      id: 'company-uuid-1',
      name: 'Test Comp',
    } as Company,
    requiredSkills: [],
    requiredLanguages: [],
  };

  const mockRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    setRequiredSkills: jest.fn(),
    setRequiredLanguages: jest.fn(),
  };

  const mockSkillService = {
    assertExists: jest.fn(),
  };

  const mockLanguageService = {
    assertExists: jest.fn(),
  };

  const mockCompanyService = {
    findOneOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacancyService,
        { provide: VacancyRepository, useValue: mockRepository },
        { provide: SkillService, useValue: mockSkillService },
        { provide: LanguageService, useValue: mockLanguageService },
        { provide: CompanyService, useValue: mockCompanyService },
      ],
    }).compile();

    service = module.get<VacancyService>(VacancyService);
    repository = module.get(VacancyRepository);
    skillService = module.get(SkillService);
    languageService = module.get(LanguageService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateVacancyDto = {
      title: mockVacancy.title,
      description: mockVacancy.description,
      salaryMin: mockVacancy.salaryMin,
      salaryMax: mockVacancy.salaryMax,
      seniorityLevel: mockVacancy.seniorityLevel,
      workFormat: mockVacancy.workFormat,
      employmentType: mockVacancy.employmentType,
    };
    const companyId = 'company-uuid-1';

    it('should create a vacancy', async () => {
      repository.create.mockResolvedValue(mockVacancy);

      const result = await service.create(companyId, dto);

      expect(repository.create).toHaveBeenCalledWith(companyId, dto);
      expect(result).toEqual(mockVacancy);
    });
  });

  describe('findOneOrThrow', () => {
    const where = { id: 'vacancy-uuid-1' };

    it('should return vacancy if found', async () => {
      repository.findOne.mockResolvedValue(mockVacancy);

      const result = await service.findOneOrThrow(where);

      expect(repository.findOne).toHaveBeenCalledWith(where);
      expect(result).toEqual(mockVacancy);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneOrThrow(where)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findMany', () => {
    const defaultDto: FindManyVacanciesDto = {
      page: 1,
      take: 10,
    };

    it('should return paged data with default params', async () => {
      const data = [mockVacancy];
      const total = 1;

      repository.findMany.mockResolvedValue(data);
      repository.count.mockResolvedValue(total);

      const result = await service.findMany(defaultDto);

      expect(repository.findMany).toHaveBeenCalledWith(
        { isActive: true },
        { createdAt: Prisma.SortOrder.desc },
        0,
        10,
      );
      expect(result).toEqual({
        data,
        meta: { total: 1, page: 1, totalPages: 1 },
      });
    });

    it('should build correct query with filters', async () => {
      const dto: FindManyVacanciesDto = {
        page: 2,
        take: 5,
        title: 'Nest',
        seniorityLevels: [SeniorityLevel.SENIOR],
      };

      repository.findMany.mockResolvedValue([]);
      repository.count.mockResolvedValue(0);

      await service.findMany(dto);

      expect(repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          title: { contains: 'Nest', mode: 'insensitive' },
          seniorityLevel: { in: [SeniorityLevel.SENIOR] },
          isActive: true,
        }),
        expect.anything(),
        5,
        5,
      );
    });
  });

  describe('update', () => {
    const where = { id: 'vacancy-uuid-1' };
    const dto: UpdateVacancyDto = { title: 'Updated Title' };

    it('should update vacancy', async () => {
      const updatedVacancy = { ...mockVacancy, title: 'Updated Title' };
      repository.update.mockResolvedValue(updatedVacancy);

      const result = await service.update(where, dto);

      expect(repository.update).toHaveBeenCalledWith(where, dto);
      expect(result).toEqual(updatedVacancy);
    });
  });

  describe('delete', () => {
    const where = { id: 'vacancy-uuid-1' };

    it('should delete vacancy', async () => {
      repository.delete.mockResolvedValue(mockVacancy);

      const result = await service.delete(where);

      expect(repository.delete).toHaveBeenCalledWith(where);
      expect(result).toEqual(mockVacancy);
    });
  });

  describe('setRequiredSkills', () => {
    const dto: SetSkillsDto = { requiredSkillIds: ['skill-1', 'skill-2'] };

    it('should assert skills exist and update relation', async () => {
      repository.setRequiredSkills.mockResolvedValue(mockVacancy);

      const result = await service.setRequiredSkills(mockVacancy.id, dto);

      expect(skillService.assertExists).toHaveBeenCalledWith(
        dto.requiredSkillIds,
      );
      expect(repository.setRequiredSkills).toHaveBeenCalledWith(
        mockVacancy.id,
        [{ skillId: 'skill-1' }, { skillId: 'skill-2' }],
      );
      expect(result).toEqual(mockVacancy);
    });
  });

  describe('setRequiredLanguages', () => {
    const dto: SetLanguagesDto = {
      requiredLanguages: [
        { languageId: 'lang-1', level: LanguageLevel.UPPER_INTERMEDIATE },
      ],
    };

    it('should assert languages exist and update relation', async () => {
      repository.setRequiredLanguages.mockResolvedValue(mockVacancy);

      const result = await service.setRequiredLanguages(mockVacancy.id, dto);

      expect(languageService.assertExists).toHaveBeenCalledWith(['lang-1']);
      expect(repository.setRequiredLanguages).toHaveBeenCalledWith(
        mockVacancy.id,
        dto.requiredLanguages,
      );
      expect(result).toEqual(mockVacancy);
    });
  });
});
