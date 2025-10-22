import { ApplicationService } from './application.service';
import { ApplicationRepository } from './application.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Application,
  ApplicationStatus,
  EmploymentType,
  JobSeeker,
  Prisma,
  SeniorityLevel,
  Vacancy,
  WorkFormat,
} from '@prisma/client';
import { VacancyService } from '../vacancy/vacancy.service';
import { JobSeekerService } from '../job-seeker/job-seeker.service';
import { getPaginationByPage, createPaginationMeta } from '@common/utils';
import { ConfigService } from '@nestjs/config';
import { CreateApplicationDto } from './dto/create-application.dto';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { SearchApplicationDto } from './dto/search-application';
import { SetStatusDto } from './dto/set-status.dto';

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

describe('ApplicationService', () => {
  let service: ApplicationService;
  let repository: jest.Mocked<ApplicationRepository>;
  let vacancyService: jest.Mocked<VacancyService>;
  let jobSeekerService: jest.Mocked<JobSeekerService>;

  const mockedApplication: Application = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    jobSeekerId: '123e4567-e89b-12d3-a456-426614174001',
    vacancyId: '123e4567-e89b-12d3-a456-426614174003',
    status: ApplicationStatus.SUBMITTED,
    coverLetter: 'Test cover letter',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockVacancy: Vacancy = {
    id: '123e4567-e89b-12d3-a456-426614174003',
    companyId: '123e4567-e89b-12d3-a456-426614174007',
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

  const mockJobSeeker: JobSeeker = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    userId: '123e4567-e89b-12d3-a456-426614174005',
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

  describe('findOneOrThrow', () => {
    const where: Prisma.ApplicationWhereUniqueInput = {
      id: '123e4567-e89b-12d3-a456-426614174001',
    };

    it('should return an application', async () => {
      repository.findOne.mockResolvedValue(mockedApplication);

      const result = await service.findOneOrThrow(where);

      expect(repository.findOne).toHaveBeenCalledWith(where, true);
      expect(result).toEqual(mockedApplication);
    });

    it('should throw NotFoundException if application does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneOrThrow(where)).rejects.toThrow(
        new NotFoundException('Application not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith(where, true);
    });
  });

  describe('searchByVacancyId', () => {
    const mockPagination = { skip: 0, take: pageSize };
    const vacancyId = '123e4567-e89b-12d3-a456-426614174000';
    const dto: SearchApplicationDto = {
      status: ApplicationStatus.SUBMITTED,
      orderBy: {
        createdAt: 'asc',
      },
      page: 1,
    };
    const where = { vacancyId, status: dto.status };
    const applications = [mockedApplication];
    const meta = {
      total: applications.length,
      page: dto.page,
      totalPages: pageSize,
    };

    it('should return applications', async () => {
      vacancyService.findOneOrThrow.mockResolvedValue(mockVacancy);
      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(applications);
      repository.count.mockResolvedValue(applications.length);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.searchByVacancyId(vacancyId, dto);

      expect(vacancyService.findOneOrThrow).toHaveBeenCalledWith({
        id: vacancyId,
      });
      expect(mockedGetPaginationByPage).toHaveBeenCalledWith(
        dto.page,
        pageSize,
      );
      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where,
          ...mockPagination,
          orderBy: dto.orderBy,
        },
        true,
      );
      expect(repository.count).toHaveBeenCalledWith(where);
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        applications.length,
        dto.page,
        pageSize,
      );
      expect(result).toEqual({
        data: applications,
        meta,
      });
    });
  });

  describe('searchByJobSeekerId', () => {
    const mockPagination = { skip: 0, take: pageSize };
    const jobSeekerId = '123e4567-e89b-12d3-a456-426614174001';
    const dto: SearchApplicationDto = {
      status: ApplicationStatus.SUBMITTED,
      orderBy: {
        createdAt: 'asc',
      },
      page: 1,
    };
    const where = { jobSeekerId, status: dto.status };
    const applications = [mockedApplication];
    const meta = {
      total: applications.length,
      page: dto.page,
      totalPages: pageSize,
    };

    it('should return applications', async () => {
      jobSeekerService.findOneOrThrow.mockResolvedValue(mockJobSeeker);
      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(applications);
      repository.count.mockResolvedValue(applications.length);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.searchByJobSeekerId(jobSeekerId, dto);

      expect(jobSeekerService.findOneOrThrow).toHaveBeenCalledWith({
        id: jobSeekerId,
      });
      expect(mockedGetPaginationByPage).toHaveBeenCalledWith(
        dto.page,
        pageSize,
      );
      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where,
          ...mockPagination,
          orderBy: dto.orderBy,
        },
        true,
      );
      expect(repository.count).toHaveBeenCalledWith(where);
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        applications.length,
        dto.page,
        pageSize,
      );
      expect(result).toEqual({
        data: applications,
        meta,
      });
    });
  });

  describe('search', () => {
    const applications = [mockedApplication];
    const dto: SearchApplicationDto = {
      status: ApplicationStatus.SUBMITTED,
      orderBy: {
        createdAt: 'asc',
      },
      page: 1,
    };
    const mockPagination = { skip: 0, take: pageSize };
    const meta = {
      total: applications.length,
      page: dto.page,
      totalPages: pageSize,
    };
    const additionalWhereParams: Prisma.ApplicationWhereInput = {
      jobSeekerId: '123e4567-e89b-12d3-a456-426614174001',
      status: dto.status,
    };
    const where = { ...additionalWhereParams };

    it('should return applications', async () => {
      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(applications);
      repository.count.mockResolvedValue(applications.length);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.search(dto, additionalWhereParams);

      expect(mockedGetPaginationByPage).toHaveBeenCalledWith(
        dto.page,
        pageSize,
      );
      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where,
          ...mockPagination,
          orderBy: dto.orderBy,
        },
        true,
      );
      expect(repository.count).toHaveBeenCalledWith(where);
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        applications.length,
        dto.page,
        pageSize,
      );
      expect(result).toEqual({
        data: applications,
        meta,
      });
    });

    it('should return applications with default orderBy and status', async () => {
      const additionalWhereParams: Prisma.ApplicationWhereInput = {
        jobSeekerId: '123e4567-e89b-12d3-a456-426614174001',
      };
      const dto: SearchApplicationDto = {
        page: 1,
      };
      const where = { ...additionalWhereParams };

      mockedGetPaginationByPage.mockReturnValue(mockPagination);
      repository.findMany.mockResolvedValue(applications);
      repository.count.mockResolvedValue(applications.length);
      mockedCreatePaginationMeta.mockReturnValue(meta);

      const result = await service.search(dto, additionalWhereParams);

      expect(mockedGetPaginationByPage).toHaveBeenCalledWith(
        dto.page,
        pageSize,
      );
      expect(repository.findMany).toHaveBeenCalledWith(
        {
          where,
          ...mockPagination,
          orderBy: { createdAt: 'desc' },
        },
        true,
      );
      expect(repository.count).toHaveBeenCalledWith(where);
      expect(mockedCreatePaginationMeta).toHaveBeenCalledWith(
        applications.length,
        dto.page,
        pageSize,
      );
      expect(result).toEqual({
        data: applications,
        meta,
      });
    });
  });

  describe('setStatus', () => {
    const id: string = '123e4567-e89b-12d3-a456-426614174000';
    const companyId: string = '123e4567-e89b-12d3-a456-426614174007';
    const dto: SetStatusDto = {
      status: ApplicationStatus.REJECTED,
    };

    it('should update application status', async () => {
      repository.findOne.mockResolvedValue(mockedApplication);
      vacancyService.findOneOrThrow.mockResolvedValue(mockVacancy);
      repository.update.mockResolvedValue({
        ...mockedApplication,
        status: dto.status,
      });

      const result = await service.setStatus(id, companyId, dto);

      expect(repository.findOne).toHaveBeenCalledWith({ id }, true);
      expect(vacancyService.findOneOrThrow).toHaveBeenCalledWith({
        id: mockVacancy.id,
      });
      expect(repository.update).toHaveBeenCalledWith({ id }, dto, true);
      expect(result).toEqual({
        ...mockedApplication,
        status: dto.status,
      });
    });

    it('should throw ForbiddenException if you are not allowed', async () => {
      repository.findOne.mockResolvedValue(mockedApplication);
      vacancyService.findOneOrThrow.mockResolvedValue({
        ...mockVacancy,
        companyId: '123e4567-e89b-12d3-a456-426614174008',
      });

      await expect(service.setStatus(id, companyId, dto)).rejects.toThrow(
        new ForbiddenException(
          'You are not allowed to change the status of this application',
        ),
      );

      expect(repository.findOne).toHaveBeenCalledWith({ id }, true);
      expect(vacancyService.findOneOrThrow).toHaveBeenCalledWith({
        id: mockVacancy.id,
      });
    });
  });
});
