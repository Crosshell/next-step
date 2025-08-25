import { Test, TestingModule } from '@nestjs/testing';
import { JobSeekerSearchService } from './job-seeker-search.service';
import { ConfigService } from '@nestjs/config';
import { JobSeekerRepository } from './job-seeker.repository';
import { SkillService } from '../skill/skill.service';
import { LanguageService } from '../language/language.service';
import { SearchJobSeekerDto } from './dto/search-job-seeker.dto';
import { JobSeeker, LanguageLevel, SeniorityLevel } from '@prisma/client';
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

describe('JobSeekerSearchService', () => {
  let service: JobSeekerSearchService;
  let repository: jest.Mocked<JobSeekerRepository>;
  let skillService: jest.Mocked<SkillService>;
  let languageService: jest.Mocked<LanguageService>;

  const mockJobSeeker: JobSeeker = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    firstName: 'firstName',
    lastName: 'lastName',
    location: 'New York',
    bio: 'Software Engineer',
    avatarUrl: 'https:/avatarUrl',
    dateOfBirth: new Date(),
    expectedSalary: 300,
    isOpenToWork: true,
    seniorityLevel: SeniorityLevel.MIDDLE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const pageSize: number = 20;

  beforeEach(async () => {
    const mockConfigService = {
      getOrThrow: jest.fn(),
    };

    const mockJobSeekerRepository = {
      findMany: jest.fn(),
      count: jest.fn(),
    };

    const mockSkillService = {
      assertExists: jest.fn(),
    };

    const mockLanguageService = {
      assertExists: jest.fn(),
    };

    mockConfigService.getOrThrow.mockReturnValue(pageSize);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobSeekerSearchService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JobSeekerRepository,
          useValue: mockJobSeekerRepository,
        },
        {
          provide: SkillService,
          useValue: mockSkillService,
        },
        {
          provide: LanguageService,
          useValue: mockLanguageService,
        },
      ],
    }).compile();

    service = module.get<JobSeekerSearchService>(JobSeekerSearchService);
    repository = module.get(JobSeekerRepository);
    skillService = module.get(SkillService);
    languageService = module.get(LanguageService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    const mockPagination = { skip: 0, take: pageSize };
    const mockLanguageLevels: LanguageLevel[] = [
      LanguageLevel.INTERMEDIATE,
      LanguageLevel.ADVANCED,
      LanguageLevel.NATIVE,
    ];

    it('should search job seekers with basic filters', async () => {
      const dto: SearchJobSeekerDto = {
        page: 1,
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue([mockJobSeeker]);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.search(dto);

      expect(mockedGetPaginationByPage).toHaveBeenCalledWith(
        dto.page,
        pageSize,
      );
      expect(repository.findMany).toHaveBeenCalledWith({
        where: { isOpenToWork: true },
        ...mockPagination,
        orderBy: { updatedAt: 'desc' },
      });
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        total,
        dto.page,
        pageSize,
      );
      expect(skillService.assertExists).not.toHaveBeenCalled();
      expect(languageService.assertExists).not.toHaveBeenCalled();
      expect(result).toEqual({ data: [mockJobSeeker], meta });
    });

    it('should search job seekers with skill filters', async () => {
      const dto: SearchJobSeekerDto = {
        page: 1,
        skillIds: [
          '123e4567-e89b-12d3-a456-426614174001',
          '123e4567-e89b-12d3-a456-426614174002',
        ],
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      skillService.assertExists.mockResolvedValue(undefined);
      repository.findMany.mockResolvedValue([mockJobSeeker]);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.search(dto);

      expect(skillService.assertExists).toHaveBeenCalledWith([
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174002',
      ]);
      expect(repository.findMany).toHaveBeenCalledWith({
        where: {
          isOpenToWork: true,
          AND: [
            {
              skills: {
                some: { skillId: '123e4567-e89b-12d3-a456-426614174001' },
              },
            },
            {
              skills: {
                some: { skillId: '123e4567-e89b-12d3-a456-426614174002' },
              },
            },
          ],
        },
        ...mockPagination,
        orderBy: { updatedAt: 'desc' },
      });
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        total,
        dto.page,
        pageSize,
      );
      expect(result).toEqual({ data: [mockJobSeeker], meta });
    });

    it('should search job seekers with language filters', async () => {
      const dto: SearchJobSeekerDto = {
        page: 1,
        languages: [
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
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      mockedGetLanguageLevelsFromLevel.mockReturnValue(mockLanguageLevels);
      languageService.assertExists.mockResolvedValue(undefined);
      repository.findMany.mockResolvedValue([mockJobSeeker]);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.search(dto);

      expect(languageService.assertExists).toHaveBeenCalledWith([
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174002',
      ]);
      expect(getLanguageLevelsFromLevel).toHaveBeenCalledWith({
        minLevel: 'INTERMEDIATE',
      });
      expect(getLanguageLevelsFromLevel).toHaveBeenCalledWith({
        minLevel: 'ADVANCED',
      });
      expect(repository.findMany).toHaveBeenCalledWith({
        where: {
          isOpenToWork: true,
          AND: [
            {
              languages: {
                some: {
                  languageId: '123e4567-e89b-12d3-a456-426614174001',
                  level: { in: mockLanguageLevels },
                },
              },
            },
            {
              languages: {
                some: {
                  languageId: '123e4567-e89b-12d3-a456-426614174002',
                  level: { in: mockLanguageLevels },
                },
              },
            },
          ],
        },
        ...mockPagination,
        orderBy: { updatedAt: 'desc' },
      });
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        total,
        dto.page,
        pageSize,
      );
      expect(result).toEqual({ data: [mockJobSeeker], meta });
    });

    it('should search job seekers with seniority level filters', async () => {
      const dto: SearchJobSeekerDto = {
        page: 1,
        seniorityLevels: [SeniorityLevel.JUNIOR, SeniorityLevel.MIDDLE],
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue([mockJobSeeker]);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.search(dto);

      expect(repository.findMany).toHaveBeenCalledWith({
        where: {
          isOpenToWork: true,
          seniorityLevel: {
            in: [SeniorityLevel.JUNIOR, SeniorityLevel.MIDDLE],
          },
        },
        ...mockPagination,
        orderBy: { updatedAt: 'desc' },
      });
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        total,
        dto.page,
        pageSize,
      );
      expect(result).toEqual({ data: [mockJobSeeker], meta });
    });

    it('should search job seekers with custom order by', async () => {
      const dto: SearchJobSeekerDto = {
        page: 1,
        orderBy: { updatedAt: 'asc' },
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue([mockJobSeeker]);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.search(dto);

      expect(repository.findMany).toHaveBeenCalledWith({
        where: { isOpenToWork: true },
        ...mockPagination,
        orderBy: { updatedAt: 'asc' },
      });
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        total,
        dto.page,
        pageSize,
      );
      expect(result).toEqual({ data: [mockJobSeeker], meta });
    });

    it('should search job seekers with all filters combined', async () => {
      const dto: SearchJobSeekerDto = {
        page: 2,
        skillIds: ['123e4567-e89b-12d3-a456-426614174001'],
        languages: [
          {
            languageId: '123e4567-e89b-12d3-a456-426614174002',
            level: LanguageLevel.INTERMEDIATE,
          },
        ],
        seniorityLevels: [SeniorityLevel.SENIOR],
        orderBy: { updatedAt: 'asc' },
      };
      const total = 60;
      const meta = { total, page: dto.page, totalPages: 4 };

      const mockPaginationPage = { skip: pageSize, take: pageSize };
      mockedGetPaginationByPage.mockReturnValue(mockPaginationPage);
      mockedGetLanguageLevelsFromLevel.mockReturnValue(mockLanguageLevels);
      skillService.assertExists.mockResolvedValue(undefined);
      languageService.assertExists.mockResolvedValue(undefined);
      repository.findMany.mockResolvedValue([mockJobSeeker]);
      repository.count.mockResolvedValue(total);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.search(dto);

      expect(skillService.assertExists).toHaveBeenCalledWith([
        '123e4567-e89b-12d3-a456-426614174001',
      ]);
      expect(languageService.assertExists).toHaveBeenCalledWith([
        '123e4567-e89b-12d3-a456-426614174002',
      ]);
      expect(mockedGetPaginationByPage).toHaveBeenCalledWith(
        dto.page,
        pageSize,
      );
      expect(repository.findMany).toHaveBeenCalledWith({
        where: {
          isOpenToWork: true,
          AND: [
            {
              languages: {
                some: {
                  languageId: '123e4567-e89b-12d3-a456-426614174002',
                  level: { in: mockLanguageLevels },
                },
              },
            },
            {
              skills: {
                some: { skillId: '123e4567-e89b-12d3-a456-426614174001' },
              },
            },
          ],
          seniorityLevel: { in: [SeniorityLevel.SENIOR] },
        },
        ...mockPaginationPage,
        orderBy: { updatedAt: 'asc' },
      });
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        total,
        dto.page,
        pageSize,
      );
      expect(result).toEqual({ data: [mockJobSeeker], meta });
    });
  });
});
