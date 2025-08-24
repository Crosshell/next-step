import { ApplicationService } from './application.service';
import { ApplicationRepository } from './application.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Application,
  ApplicationStatus,
  EmploymentType,
  Prisma,
  SeniorityLevel,
  Vacancy,
  WorkFormat,
} from '@prisma/client';
import { VacancyService } from '../vacancy/vacancy.service';
import { JobSeekerService } from '../job-seeker/job-seeker.service';
import { getPaginationByPage } from '@common/utils';
import { ConfigService } from '@nestjs/config';
import { CreateApplicationDto } from './dto/create-application.dto';
import { BadRequestException } from '@nestjs/common';

jest.mock('@common/utils', () => ({
  getPaginationByPage: jest.fn(),
}));

const mockedGetPaginationByPage = getPaginationByPage as jest.MockedFunction<
  typeof getPaginationByPage
>;

describe('ApplicationService', () => {
  let service: ApplicationService;
  let repository: jest.Mocked<ApplicationRepository>;
  let vacancyService: jest.Mocked<VacancyService>;
  let jobSeekerService: jest.Mocked<JobSeekerService>;

  const mockedApplication: Application = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    jobSeekerId: '123e4567-e89b-12d3-a456-426614174001',
    vacancyId: '123e4567-e89b-12d3-a456-426614174002',
    status: ApplicationStatus.SUBMITTED,
    coverLetter: 'Test cover letter',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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

  const pageSize: number = 20;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    };

    const mockConfigService = {
      getOrThrow: jest.fn(),
    };

    const mockVacancyService = {
      findOneOrThrow: jest.fn(),
    };

    const mockJobSeekerService = {
      findOneOrThrow: jest.fn(),
    };

    mockConfigService.getOrThrow.mockReturnValue(pageSize);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        { provide: VacancyService, useValue: mockVacancyService },
        { provide: JobSeekerService, useValue: mockJobSeekerService },
        { provide: ApplicationRepository, useValue: mockRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
    repository = module.get(ApplicationRepository);
    vacancyService = module.get(VacancyService);
    jobSeekerService = module.get(JobSeekerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateApplicationDto = {
      coverLetter: 'Test cover letter',
      vacancyId: '123e4567-e89b-12d3-a456-426614174000',
    };
    const jobSeekerId = '123e4567-e89b-12d3-a456-426614174001';

    const where = {
      jobSeekerId_vacancyId: { jobSeekerId, vacancyId: dto.vacancyId },
    };

    it('should create a new application', async () => {
      repository.findOne.mockResolvedValue(null);
      vacancyService.findOneOrThrow.mockResolvedValue(mockVacancy);
      repository.create.mockResolvedValue(mockedApplication);

      const result = await service.create(dto, jobSeekerId);

      expect(repository.findOne).toHaveBeenCalledWith(where);
      expect(vacancyService.findOneOrThrow).toHaveBeenCalledWith({
        id: dto.vacancyId,
      });
      expect(repository.create).toHaveBeenCalledWith(dto, jobSeekerId, true);
      expect(result).toEqual(mockedApplication);
    });

    it('should throw BadRequestException if application already exists', async () => {
      repository.findOne.mockResolvedValue(mockedApplication);

      await expect(service.create(dto, jobSeekerId)).rejects.toThrow(
        new BadRequestException('Application already exists'),
      );

      expect(repository.findOne).toHaveBeenCalledWith(where);
      expect(vacancyService.findOneOrThrow).not.toHaveBeenCalled();
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('assertNotExists', () => {
    const where: Prisma.ApplicationWhereUniqueInput = {
      id: '123e4567-e89b-12d3-a456-426614174001',
    };

    it('should not throw if application does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.assertNotExists(where);

      expect(repository.findOne).toHaveBeenCalledWith(where);
      expect(result).toBeUndefined();
    });

    it('should throw BadRequestException if application exists', async () => {
      repository.findOne.mockResolvedValue(mockedApplication);

      await expect(service.assertNotExists(where)).rejects.toThrow(
        new BadRequestException('Application already exists'),
      );

      expect(repository.findOne).toHaveBeenCalledWith(where);
    });
  });
});
