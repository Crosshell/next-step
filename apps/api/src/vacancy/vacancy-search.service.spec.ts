import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { VacancySearchService } from './vacancy-search.service';
import { VacancyRepository } from './vacancy.repository';
import { LanguageService } from '../language/language.service';
import { SkillService } from '../skill/skill.service';
import { SearchVacancyDto } from './dto/search-vacancy.dto';
import {
  EmploymentType,
  LanguageLevel,
  Prisma,
  SeniorityLevel,
  Vacancy,
  WorkFormat,
} from '@prisma/client';
import {
  getPaginationByPage,
  getLanguageLevelsFromLevel,
  createPaginationMeta,
} from '@common/utils';

jest.mock('@common/utils', () => ({
  getPaginationByPage: jest.fn(),
  getLanguageLevelsFromLevel: jest.fn(),
  createPaginationMeta: jest.fn(),
}));

const mockedGetPaginationByPage = getPaginationByPage as jest.MockedFunction<
  typeof getPaginationByPage
>;

const mockedGetLanguageLevelsFromLevel =
  getLanguageLevelsFromLevel as jest.MockedFunction<
    typeof getLanguageLevelsFromLevel
  >;

const mockedCreatePaginationMeta = createPaginationMeta as jest.MockedFunction<
  typeof createPaginationMeta
>;

describe('VacancySearchService', () => {
  let service: VacancySearchService;
  let repository: jest.Mocked<VacancyRepository>;
  let languageService: jest.Mocked<LanguageService>;
  let skillService: jest.Mocked<SkillService>;

  const mockVacancies: Vacancy[] = [
    {
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
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174003',
      companyId: '123e4567-e89b-12d3-a456-426614174005',
      title: 'Devops Engineer',
      description: 'Job description',
      salaryMin: 300,
      salaryMax: 1000,
      officeLocation: 'Madrid',
      experienceRequired: 5,
      isActive: true,
      seniorityLevel: SeniorityLevel.SENIOR,
      workFormat: [WorkFormat.REMOTE, WorkFormat.OFFICE],
      employmentType: [EmploymentType.CONTRACT, EmploymentType.PART_TIME],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const pageSize: number = 20;

  beforeEach(async () => {
    const mockVacancyRepository = {
      findMany: jest.fn(),
      count: jest.fn(),
    };

    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue(pageSize),
    };

    const mockLanguageService = {
      assertExists: jest.fn(),
    };

    const mockSkillService = {
      assertExists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacancySearchService,
        {
          provide: VacancyRepository,
          useValue: mockVacancyRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: LanguageService,
          useValue: mockLanguageService,
        },
        {
          provide: SkillService,
          useValue: mockSkillService,
        },
      ],
    }).compile();

    service = module.get<VacancySearchService>(VacancySearchService);
    repository = module.get(VacancyRepository);
    languageService = module.get(LanguageService);
    skillService = module.get(SkillService);

    mockedGetPaginationByPage.mockReturnValue({ skip: 0, take: pageSize });
    mockedGetLanguageLevelsFromLevel.mockReturnValue([
      LanguageLevel.ELEMENTARY,
      LanguageLevel.PRE_INTERMEDIATE,
    ]);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    const mockPagination = { skip: 0, take: pageSize };

    it('should search vacancies with basic filters', async () => {
      const dto: SearchVacancyDto = {
        title: 'Software Engineer',
        page: 1,
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(mockVacancies);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.search(dto);

      expect(result).toEqual({ meta, data: mockVacancies });
      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where: {
            isActive: true,
            title: { contains: 'Software Engineer', mode: 'insensitive' },
          },
          skip: 0,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        },
        true,
      );
    });

    it('should search with custom order by', async () => {
      const dto: SearchVacancyDto = {
        title: 'Developer',
        orderBy: { salaryMin: 'desc' },
        page: 1,
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(mockVacancies);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      await service.search(dto);

      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where: {
            isActive: true,
            title: { contains: 'Developer', mode: 'insensitive' },
          },
          skip: 0,
          take: pageSize,
          orderBy: { salaryMin: 'desc' },
        },
        true,
      );
    });

    it('should search with salary filter', async () => {
      const dto: SearchVacancyDto = {
        salaryMin: 80000,
        page: 1,
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(mockVacancies);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      await service.search(dto);

      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where: {
            isActive: true,
            OR: [{ salaryMax: { gte: 80000 } }, { salaryMin: { gte: 80000 } }],
          },
          skip: 0,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        },
        true,
      );
    });

    it('should search with experience filter', async () => {
      const dto: SearchVacancyDto = {
        experienceRequired: 5,
        page: 1,
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(mockVacancies);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      await service.search(dto);

      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where: {
            isActive: true,
            experienceRequired: { lte: 5 },
          },
          skip: 0,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        },
        true,
      );
    });

    it('should search with work formats filter', async () => {
      const dto: SearchVacancyDto = {
        workFormats: [WorkFormat.REMOTE, WorkFormat.HYBRID],
        page: 1,
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(mockVacancies);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      await service.search(dto);

      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where: {
            isActive: true,
            workFormat: { hasSome: [WorkFormat.REMOTE, WorkFormat.HYBRID] },
          },
          skip: 0,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        },
        true,
      );
    });

    it('should search with employment types filter', async () => {
      const dto: SearchVacancyDto = {
        employmentTypes: [EmploymentType.FULL_TIME, EmploymentType.PART_TIME],
        page: 1,
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(mockVacancies);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      await service.search(dto);

      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where: {
            isActive: true,
            employmentType: {
              hasSome: [EmploymentType.FULL_TIME, EmploymentType.PART_TIME],
            },
          },
          skip: 0,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        },
        true,
      );
    });

    it('should search with seniority level filter', async () => {
      const dto: SearchVacancyDto = {
        seniorityLevel: SeniorityLevel.SENIOR,
        page: 1,
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(mockVacancies);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      await service.search(dto);

      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where: {
            isActive: true,
            seniorityLevel: { equals: SeniorityLevel.SENIOR },
          },
          skip: 0,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        },
        true,
      );
    });

    it('should search with required skills filter', async () => {
      const dto: SearchVacancyDto = {
        requiredSkillIds: [
          '123e4567-e89b-12d3-a456-426614174010',
          '123e4567-e89b-12d3-a456-426614174011',
        ],
        page: 1,
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      skillService.assertExists.mockResolvedValue();
      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(mockVacancies);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      await service.search(dto);

      expect(skillService.assertExists).toHaveBeenCalledWith([
        '123e4567-e89b-12d3-a456-426614174010',
        '123e4567-e89b-12d3-a456-426614174011',
      ]);
      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where: {
            isActive: true,
            requiredSkills: {
              some: {
                skillId: {
                  in: [
                    '123e4567-e89b-12d3-a456-426614174010',
                    '123e4567-e89b-12d3-a456-426614174011',
                  ],
                },
              },
            },
          },
          skip: 0,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        },
        true,
      );
    });

    it('should search with required languages filter', async () => {
      const dto: SearchVacancyDto = {
        requiredLanguages: [
          {
            languageId: '123e4567-e89b-12d3-a456-426614174010',
            level: LanguageLevel.INTERMEDIATE,
          },
          {
            languageId: '123e4567-e89b-12d3-a456-426614174011',
            level: LanguageLevel.ADVANCED,
          },
        ],
        page: 1,
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      languageService.assertExists.mockResolvedValue();
      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(mockVacancies);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      await service.search(dto);

      expect(languageService.assertExists).toHaveBeenCalledWith([
        '123e4567-e89b-12d3-a456-426614174010',
        '123e4567-e89b-12d3-a456-426614174011',
      ]);
      expect(mockedGetLanguageLevelsFromLevel).toHaveBeenCalledWith({
        maxLevel: LanguageLevel.INTERMEDIATE,
      });
      expect(mockedGetLanguageLevelsFromLevel).toHaveBeenCalledWith({
        maxLevel: LanguageLevel.ADVANCED,
      });
      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where: {
            isActive: true,
            requiredLanguages: {
              some: {
                OR: [
                  {
                    languageId: '123e4567-e89b-12d3-a456-426614174010',
                    level: {
                      in: [
                        LanguageLevel.ELEMENTARY,
                        LanguageLevel.PRE_INTERMEDIATE,
                      ],
                    },
                  },
                  {
                    languageId: '123e4567-e89b-12d3-a456-426614174011',
                    level: {
                      in: [
                        LanguageLevel.ELEMENTARY,
                        LanguageLevel.PRE_INTERMEDIATE,
                      ],
                    },
                  },
                ],
              },
            },
          },
          skip: 0,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        },
        true,
      );
    });

    it('should search with all filters combined', async () => {
      const dto: SearchVacancyDto = {
        title: 'Engineer',
        salaryMin: 100000,
        experienceRequired: 3,
        workFormats: [WorkFormat.REMOTE],
        employmentTypes: [EmploymentType.FULL_TIME],
        seniorityLevel: SeniorityLevel.MIDDLE,
        requiredSkillIds: ['123e4567-e89b-12d3-a456-426614174010'],
        requiredLanguages: [
          {
            languageId: '123e4567-e89b-12d3-a456-426614174011',
            level: LanguageLevel.INTERMEDIATE,
          },
        ],
        page: 2,
        orderBy: { createdAt: 'asc' },
      };

      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      skillService.assertExists.mockResolvedValue();
      languageService.assertExists.mockResolvedValue();
      mockedGetPaginationByPage.mockReturnValue({
        skip: pageSize,
        take: pageSize,
      });
      repository.findMany.mockResolvedValue(mockVacancies);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      await service.search(dto);

      expect(mockedGetPaginationByPage).toHaveBeenCalledWith(
        dto.page,
        pageSize,
      );
      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where: {
            isActive: true,
            title: { contains: 'Engineer', mode: 'insensitive' },
            OR: [
              { salaryMax: { gte: 100000 } },
              { salaryMin: { gte: 100000 } },
            ],
            experienceRequired: { lte: 3 },
            workFormat: { hasSome: [WorkFormat.REMOTE] },
            employmentType: { hasSome: [EmploymentType.FULL_TIME] },
            seniorityLevel: { equals: SeniorityLevel.MIDDLE },
            requiredSkills: {
              some: {
                skillId: { in: ['123e4567-e89b-12d3-a456-426614174010'] },
              },
            },
            requiredLanguages: {
              some: {
                OR: [
                  {
                    languageId: '123e4567-e89b-12d3-a456-426614174011',
                    level: {
                      in: [
                        LanguageLevel.ELEMENTARY,
                        LanguageLevel.PRE_INTERMEDIATE,
                      ],
                    },
                  },
                ],
              },
            },
          },
          skip: pageSize,
          take: pageSize,
          orderBy: { createdAt: 'asc' },
        },
        true,
      );
    });

    describe('validateSearchFilters', () => {
      it('should validate skills when provided', async () => {
        const dto: SearchVacancyDto = {
          requiredSkillIds: [
            '123e4567-e89b-12d3-a456-426614174010',
            '123e4567-e89b-12d3-a456-426614174011',
          ],
          page: 1,
        };
        const total = 60;
        const meta = { total, page: dto.page, totalPages: 4 };

        skillService.assertExists.mockResolvedValue();
        mockedGetPaginationByPage.mockReturnValue(mockPagination);
        repository.findMany.mockResolvedValue(mockVacancies);
        repository.count.mockResolvedValue(total);
        mockedCreatePaginationMeta.mockReturnValue(meta);

        await service.search(dto);

        expect(skillService.assertExists).toHaveBeenCalledWith([
          '123e4567-e89b-12d3-a456-426614174010',
          '123e4567-e89b-12d3-a456-426614174011',
        ]);
      });

      it('should validate languages when provided', async () => {
        const dto: SearchVacancyDto = {
          requiredLanguages: [
            {
              languageId: '123e4567-e89b-12d3-a456-426614174010',
              level: LanguageLevel.INTERMEDIATE,
            },
            {
              languageId: '123e4567-e89b-12d3-a456-426614174011',
              level: LanguageLevel.ADVANCED,
            },
          ],
          page: 1,
        };
        const total = 60;
        const meta = { total, page: dto.page, totalPages: 4 };

        languageService.assertExists.mockResolvedValue();
        mockedGetPaginationByPage.mockReturnValue(mockPagination);
        repository.findMany.mockResolvedValue(mockVacancies);
        repository.count.mockResolvedValue(total);
        mockedCreatePaginationMeta.mockReturnValue(meta);

        await service.search(dto);

        expect(languageService.assertExists).toHaveBeenCalledWith([
          '123e4567-e89b-12d3-a456-426614174010',
          '123e4567-e89b-12d3-a456-426614174011',
        ]);
      });

      it('should not validate when no skills or languages provided', async () => {
        const dto: SearchVacancyDto = {
          title: 'Engineer',
          page: 1,
        };

        await service.search(dto);

        expect(skillService.assertExists).not.toHaveBeenCalled();
        expect(languageService.assertExists).not.toHaveBeenCalled();
      });
    });

    describe('buildLanguageFilter', () => {
      it('should build language filter correctly', async () => {
        const dto: SearchVacancyDto = {
          requiredLanguages: [
            {
              languageId: '123e4567-e89b-12d3-a456-426614174010',
              level: LanguageLevel.ADVANCED,
            },
          ],
          page: 1,
        };
        const total = 60;
        const meta = { total, page: dto.page, totalPages: 4 };

        mockedGetPaginationByPage.mockReturnValue(mockPagination);
        repository.findMany.mockResolvedValue(mockVacancies);
        repository.count.mockResolvedValue(total);
        mockedCreatePaginationMeta.mockReturnValue(meta);
        languageService.assertExists.mockResolvedValue();
        mockedGetLanguageLevelsFromLevel.mockReturnValue([
          LanguageLevel.ELEMENTARY,
          LanguageLevel.PRE_INTERMEDIATE,
          LanguageLevel.INTERMEDIATE,
          LanguageLevel.UPPER_INTERMEDIATE,
          LanguageLevel.ADVANCED,
        ]);

        await service.search(dto);

        expect(getLanguageLevelsFromLevel).toHaveBeenCalledWith({
          maxLevel: LanguageLevel.ADVANCED,
        });
        expect(repository.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              requiredLanguages: {
                some: {
                  OR: [
                    {
                      languageId: '123e4567-e89b-12d3-a456-426614174010',
                      level: {
                        in: [
                          LanguageLevel.ELEMENTARY,
                          LanguageLevel.PRE_INTERMEDIATE,
                          LanguageLevel.INTERMEDIATE,
                          LanguageLevel.UPPER_INTERMEDIATE,
                          LanguageLevel.ADVANCED,
                        ],
                      },
                    },
                  ],
                },
              },
            }) as Prisma.VacancyFindManyArgs,
          }),
          true,
        );
      });
    });
  });
});
