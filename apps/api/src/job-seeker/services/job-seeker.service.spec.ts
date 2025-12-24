import { Test, TestingModule } from '@nestjs/testing';
import { JobSeekerService } from './job-seeker.service';
import { JobSeekerRepository } from '../repositories/job-seeker.repository';
import { SkillService } from '../../skill/services/skill.service';
import { LanguageService } from '../../language/services/language.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LanguageLevel, Prisma } from '@prisma/client';
import { CreateJobSeekerDto } from '../dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from '../dto/update-job-seeker.dto';
import { FindManyJobSeekersDto } from '../dto/find-many-job-seekers.dto';
import { SetSkillsDto } from '../dto/set-skills.dto';
import { SetLanguagesDto } from '../dto/set-languages.dto';
import { SetContactsDto } from '../dto/set-contacts.dto';
import { UserWithoutPassword } from '../../user/types/user-without-password.type';
import { JobSeekerWithRelations } from '../types/job-seeker-with-relations.type';

describe('JobSeekerService', () => {
  let service: JobSeekerService;
  let repository: jest.Mocked<JobSeekerRepository>;
  let skillService: jest.Mocked<SkillService>;
  let languageService: jest.Mocked<LanguageService>;

  const mockJobSeekerRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    setSkills: jest.fn(),
    setLanguages: jest.fn(),
    setContacts: jest.fn(),
  };

  const mockSkillService = {
    assertExists: jest.fn(),
  };

  const mockLanguageService = {
    assertExists: jest.fn(),
  };

  const mockUser = {
    id: 'user-uuid-1',
    email: 'test@test.com',
  } as UserWithoutPassword;

  const mockJobSeeker = {
    id: 'job-seeker-uuid-1',
    userId: 'user-uuid-1',
    firstName: 'First',
    lastName: 'Last',
  } as JobSeekerWithRelations;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobSeekerService,
        { provide: JobSeekerRepository, useValue: mockJobSeekerRepository },
        { provide: SkillService, useValue: mockSkillService },
        { provide: LanguageService, useValue: mockLanguageService },
      ],
    }).compile();

    service = module.get<JobSeekerService>(JobSeekerService);
    repository = module.get(JobSeekerRepository);
    skillService = module.get(SkillService);
    languageService = module.get(LanguageService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateJobSeekerDto = {
      firstName: 'First',
      lastName: 'Last',
    };

    it('should create a job seeker profile', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockJobSeeker);

      const result = await service.create(mockUser.id, dto);

      expect(repository.findOne).toHaveBeenCalledWith({ userId: mockUser.id });
      expect(repository.create).toHaveBeenCalledWith(mockUser.id, dto);
      expect(result).toEqual(mockJobSeeker);
    });

    it('should throw BadRequestException if job seeker already exists', async () => {
      repository.findOne.mockResolvedValue(mockJobSeeker);

      await expect(service.create(mockUser.id, dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findOneOrThrow', () => {
    it('should return job seeker if found', async () => {
      repository.findOne.mockResolvedValue(mockJobSeeker);

      const result = await service.findOneOrThrow({ id: mockJobSeeker.id });

      expect(result).toEqual(mockJobSeeker);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.findOneOrThrow({ id: mockJobSeeker.id }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMany', () => {
    const defaultDto: FindManyJobSeekersDto = {
      page: 2,
      take: 10,
    };

    it('should return paged data with default params', async () => {
      const data = [mockJobSeeker];
      const total = 30;

      repository.findMany.mockResolvedValue(data);
      repository.count.mockResolvedValue(total);

      const result = await service.findMany(defaultDto);

      expect(repository.findMany).toHaveBeenCalledWith(
        {
          isOpenToWork: true,
        },
        { updatedAt: Prisma.SortOrder.desc },
        10,
        10,
      );

      expect(result.data).toEqual(data);
      expect(result.meta.total).toBe(total);
    });
  });

  describe('update', () => {
    it('should call repository update', async () => {
      const dto: UpdateJobSeekerDto = { firstName: 'Updated' };
      repository.update.mockResolvedValue({ ...mockJobSeeker, ...dto });

      const result = await service.update(mockJobSeeker.id, dto);

      expect(repository.update).toHaveBeenCalledWith(
        { id: mockJobSeeker.id },
        dto,
      );
      expect(result.firstName).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('should call repository delete', async () => {
      repository.delete.mockResolvedValue(mockJobSeeker);

      await service.delete(mockJobSeeker.id);

      expect(repository.delete).toHaveBeenCalledWith({ id: mockJobSeeker.id });
    });
  });

  describe('setSkills', () => {
    it('should assert skills exist and map ids correctly', async () => {
      const dto: SetSkillsDto = { skillIds: ['skill-uuid-1', 'skill-uuid-2'] };
      repository.setSkills.mockResolvedValue(mockJobSeeker);

      await service.setSkills(mockJobSeeker.id, dto);

      expect(skillService.assertExists).toHaveBeenCalledWith([
        'skill-uuid-1',
        'skill-uuid-2',
      ]);
      expect(repository.setSkills).toHaveBeenCalledWith(mockJobSeeker.id, [
        { skillId: 'skill-uuid-1' },
        { skillId: 'skill-uuid-2' },
      ]);
    });
  });

  describe('setLanguages', () => {
    it('should assert languages exist and call repository', async () => {
      const dto: SetLanguagesDto = {
        languages: [{ languageId: 'lang-uuid-1', level: LanguageLevel.NATIVE }],
      };
      repository.setLanguages.mockResolvedValue(mockJobSeeker);

      await service.setLanguages(mockJobSeeker.id, dto);

      expect(languageService.assertExists).toHaveBeenCalledWith([
        'lang-uuid-1',
      ]);
      expect(repository.setLanguages).toHaveBeenCalledWith(
        mockJobSeeker.id,
        dto.languages,
      );
    });
  });

  describe('setContacts', () => {
    it('should call repository setContacts', async () => {
      const dto: SetContactsDto = { githubUrl: 'https://github.com/user' };
      repository.setContacts.mockResolvedValue(mockJobSeeker);

      await service.setContacts(mockJobSeeker.id, dto);

      expect(repository.setContacts).toHaveBeenCalledWith(
        mockJobSeeker.id,
        dto,
      );
    });
  });
});
