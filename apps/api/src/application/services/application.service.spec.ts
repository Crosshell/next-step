import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from './application.service';
import { ApplicationRepository } from '../repositories/application.repository';
import { VacancyService } from '../../vacancy/services/vacancy.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus, Prisma } from '@prisma/client';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { FindManyApplicationsDto } from '../dto/find-many-applications.dto';
import { VacancyWithRelations } from '../../vacancy/types/vacancy-with-relations.type';
import { ApplicationWithRelations } from '../types/application-with-relations.type';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let repository: jest.Mocked<ApplicationRepository>;
  let vacancyService: jest.Mocked<VacancyService>;

  const mockVacancy = {
    id: 'vacancy-uuid-1',
    companyId: 'company-uuid-1',
  } as VacancyWithRelations;

  const mockApplication = {
    id: 'app-uuid-1',
    vacancyId: 'vacancy-uuid-1',
    jobSeekerId: 'js-uuid-1',
  } as ApplicationWithRelations;

  const mockJobSeeker = {
    id: 'js-uuid-1',
    userId: 'user-uuid-1',
  };

  const mockRecruiter = {
    id: 'recruiter-uuid-1',
    companyId: 'company-uuid-1',
  };

  const mockRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  };

  const mockVacancyService = {
    findOneOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        { provide: ApplicationRepository, useValue: mockRepository },
        { provide: VacancyService, useValue: mockVacancyService },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
    repository = module.get(ApplicationRepository);
    vacancyService = module.get(VacancyService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateApplicationDto = {
      vacancyId: mockVacancy.id,
      coverLetter: 'Cover Letter',
    };

    it('should create an application successfully', async () => {
      repository.findOne.mockResolvedValue(null);

      vacancyService.findOneOrThrow.mockResolvedValue(mockVacancy);

      repository.create.mockResolvedValue(mockApplication);

      const result = await service.create(dto, mockJobSeeker.id);

      expect(result).toEqual(mockApplication);

      expect(repository.findOne).toHaveBeenCalledWith({
        jobSeekerId_vacancyId: {
          jobSeekerId: mockJobSeeker.id,
          vacancyId: mockVacancy.id,
        },
      });
      expect(vacancyService.findOneOrThrow).toHaveBeenCalledWith({
        id: dto.vacancyId,
      });
      expect(repository.create).toHaveBeenCalledWith(dto, mockJobSeeker.id);
    });

    it('should throw BadRequestException if application already exists', async () => {
      repository.findOne.mockResolvedValue(mockApplication);

      await expect(service.create(dto, mockJobSeeker.id)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if vacancy does not exist', async () => {
      repository.findOne.mockResolvedValue(null);
      vacancyService.findOneOrThrow.mockRejectedValue(new NotFoundException());

      await expect(service.create(dto, mockJobSeeker.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('setStatus', () => {
    const statusDto = { status: ApplicationStatus.ACCEPTED };

    it('should update status if recruiter belongs to the vacancy company', async () => {
      repository.findOne.mockResolvedValue(mockApplication);

      vacancyService.findOneOrThrow.mockResolvedValue(mockVacancy);

      const updatedApp = {
        ...mockApplication,
        status: ApplicationStatus.ACCEPTED,
      };
      repository.update.mockResolvedValue(updatedApp);

      const result = await service.setStatus(
        mockApplication.id,
        statusDto,
        mockRecruiter.companyId,
      );

      expect(result).toEqual(updatedApp);

      expect(repository.findOne).toHaveBeenCalledWith({
        id: mockApplication.id,
      });
      expect(vacancyService.findOneOrThrow).toHaveBeenCalledWith({
        id: mockVacancy.id,
      });
      expect(repository.update).toHaveBeenCalledWith(
        { id: mockApplication.id },
        statusDto,
      );
    });

    it('should throw ForbiddenException if recruiter is from another company', async () => {
      repository.findOne.mockResolvedValue(mockApplication);

      vacancyService.findOneOrThrow.mockResolvedValue({
        ...mockVacancy,
        companyId: 'company-uuid-2',
      });

      await expect(
        service.setStatus(
          mockApplication.id,
          statusDto,
          mockRecruiter.companyId,
        ),
      ).rejects.toThrow(ForbiddenException);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if application not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.setStatus(
          mockApplication.id,
          statusDto,
          mockRecruiter.companyId,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('should calculate skip correctly and apply filters', async () => {
      const dto: FindManyApplicationsDto = {
        page: 2,
        take: 10,
        status: ApplicationStatus.SUBMITTED,
        orderBy: { createdAt: Prisma.SortOrder.asc },
      };

      const total = 25;
      const mockData = [mockApplication, mockApplication];

      repository.findMany.mockResolvedValue(mockData);
      repository.count.mockResolvedValue(total);

      const result = await service.search(dto, {
        jobSeekerId: mockJobSeeker.id,
      });

      expect(repository.findMany).toHaveBeenCalledWith(
        { jobSeekerId: mockJobSeeker.id, status: ApplicationStatus.SUBMITTED },
        { createdAt: Prisma.SortOrder.asc },
        10,
        10,
      );

      expect(repository.count).toHaveBeenCalledWith({
        jobSeekerId: mockJobSeeker.id,
        status: ApplicationStatus.SUBMITTED,
      });

      expect(result).toEqual({
        data: mockData,
        meta: {
          total: 25,
          page: 2,
          totalPages: 3,
        },
      });
    });

    it('should use default values', async () => {
      const dto = {
        page: 1,
        take: 20,
      };

      repository.findMany.mockResolvedValue([]);
      repository.count.mockResolvedValue(0);

      await service.search(dto, {});

      expect(repository.findMany).toHaveBeenCalledWith(
        {},
        { createdAt: Prisma.SortOrder.desc },
        0,
        20,
      );
    });
  });

  describe('findOneOrThrow', () => {
    it('findOneOrThrow should return application', async () => {
      repository.findOne.mockResolvedValue(mockApplication);

      const result = await service.findOneOrThrow({ id: mockApplication.id });
      expect(result).toBe(mockApplication);
      expect(repository.findOne).toHaveBeenCalledWith({
        id: mockApplication.id,
      });
    });

    it('findOneOrThrow should throw NotFoundException', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(
        service.findOneOrThrow({ id: mockApplication.id }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('assertNotExists', () => {
    it('should not throw if application does not exist', async () => {
      repository.findOne.mockResolvedValue(null);
      await service.assertNotExists({ id: mockApplication.id });
      expect(repository.findOne).toHaveBeenCalledWith({
        id: mockApplication.id,
      });
    });

    it('should throw BadRequestException if application exists', async () => {
      repository.findOne.mockResolvedValue(mockApplication);
      await expect(
        service.assertNotExists({ id: mockApplication.id }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
