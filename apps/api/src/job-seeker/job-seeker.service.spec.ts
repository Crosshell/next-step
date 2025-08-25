import { JobSeekerService } from './job-seeker.service';
import { JobSeekerRepository } from './job-seeker.repository';
import { SkillService } from '../skill/skill.service';
import { LanguageService } from '../language/language.service';
import { JobSeekerSearchService } from './job-seeker-search.service';
import {
  JobSeeker,
  LanguageLevel,
  Prisma,
  SeniorityLevel,
} from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SearchJobSeekerDto } from './dto/search-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { SetSkillsDto } from './dto/set-skills.dto';
import { SetLanguagesDto } from './dto/set-languages.dto';
import { SetContactsDto } from './dto/set-contacts.dto';

describe('JobSeekerService', () => {
  let service: JobSeekerService;
  let repository: jest.Mocked<JobSeekerRepository>;
  let skillService: jest.Mocked<SkillService>;
  let languageService: jest.Mocked<LanguageService>;
  let searchService: jest.Mocked<JobSeekerSearchService>;

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

  beforeEach(async () => {
    const mockJobSeekerRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      setSkills: jest.fn(),
      setLanguages: jest.fn(),
      setContacts: jest.fn(),
      count: jest.fn(),
    };

    const mockSkillService = {
      assertExists: jest.fn(),
    };

    const mockLanguageService = {
      assertExists: jest.fn(),
    };

    const mockJobSeekerSearchService = {
      search: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobSeekerService,
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
        {
          provide: JobSeekerSearchService,
          useValue: mockJobSeekerSearchService,
        },
      ],
    }).compile();

    service = module.get<JobSeekerService>(JobSeekerService);
    repository = module.get(JobSeekerRepository);
    skillService = module.get(SkillService);
    languageService = module.get(LanguageService);
    searchService = module.get(JobSeekerSearchService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174001';
    const dto: CreateJobSeekerDto = {
      firstName: 'firstName',
      lastName: 'lastName',
      location: 'New York',
      bio: 'Software Engineer',
      avatarUrl: 'https:/avatarUrl',
      dateOfBirth: new Date(),
      expectedSalary: 300,
      isOpenToWork: true,
      seniorityLevel: SeniorityLevel.MIDDLE,
    };

    it('should create a job seeker', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockJobSeeker);

      const result = await service.create(userId, dto);

      expect(repository.findOne).toHaveBeenCalledWith({ userId });
      expect(repository.create).toHaveBeenCalledWith(userId, dto, true);
      expect(result).toEqual(mockJobSeeker);
    });

    it('should throw BadRequestException if job seeker already exists', async () => {
      repository.findOne.mockResolvedValue(mockJobSeeker);

      await expect(service.create(userId, dto)).rejects.toThrow(
        new BadRequestException('Job seeker already exists'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({ userId });
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const where: Prisma.JobSeekerWhereUniqueInput = {
      userId: '123e4567-e89b-12d3-a456-426614174001',
    };

    it('should find a job seeker', async () => {
      repository.findOne.mockResolvedValue(mockJobSeeker);

      const result = await service.findOne(where);

      expect(repository.findOne).toHaveBeenCalledWith(where, true);
      expect(result).toEqual(mockJobSeeker);
    });
  });

  describe('findOneOrThrow', () => {
    const where: Prisma.JobSeekerWhereUniqueInput = {
      userId: '123e4567-e89b-12d3-a456-426614174001',
    };

    it('should find a job seeker', async () => {
      repository.findOne.mockResolvedValue(mockJobSeeker);

      const result = await service.findOneOrThrow(where);

      expect(repository.findOne).toHaveBeenCalledWith(where, true);
      expect(result).toEqual(mockJobSeeker);
    });

    it('should throw NotFoundException if job seeker does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneOrThrow(where)).rejects.toThrow(
        new NotFoundException('Job seeker not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith(where, true);
    });
  });

  describe('assertNotExists', () => {
    const where: Prisma.JobSeekerWhereUniqueInput = {
      userId: '123e4567-e89b-12d3-a456-426614174001',
    };

    it('should not throw BadRequestException if job seeker does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.assertNotExists(where);

      expect(repository.findOne).toHaveBeenCalledWith(where);
      expect(result).toBeUndefined();
    });

    it('should throw BadRequestException if job seeker already exists', async () => {
      repository.findOne.mockResolvedValue(mockJobSeeker);

      await expect(service.assertNotExists(where)).rejects.toThrow(
        new BadRequestException('Job seeker already exists'),
      );

      expect(repository.findOne).toHaveBeenCalledWith(where);
    });
  });

  describe('search', () => {
    const dto: SearchJobSeekerDto = {
      page: 1,
      skillIds: [
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174002',
      ],
    };
    const meta = { total: 1, page: 1, totalPages: 1 };

    it('should search job seekers', async () => {
      searchService.search.mockResolvedValue({
        data: [mockJobSeeker],
        meta,
      });

      const result = await service.search(dto);

      expect(searchService.search).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        data: [mockJobSeeker],
        meta,
      });
    });
  });

  describe('update', () => {
    const id: string = '123e4567-e89b-12d3-a456-426614174000';
    const dto: UpdateJobSeekerDto = {
      firstName: 'firstName',
    };

    it('should update a job seeker', async () => {
      repository.update.mockResolvedValue(mockJobSeeker);

      const result = await service.update(id, dto);

      expect(repository.update).toHaveBeenCalledWith({ id }, dto, true);
      expect(result).toEqual(mockJobSeeker);
    });
  });

  describe('setSkills', () => {
    const id: string = '123e4567-e89b-12d3-a456-426614174000';
    const dto: SetSkillsDto = {
      skillIds: [
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174002',
      ],
    };
    const skillIds = [
      { skillId: '123e4567-e89b-12d3-a456-426614174001' },
      { skillId: '123e4567-e89b-12d3-a456-426614174002' },
    ];

    it('should set skills for a job seeker', async () => {
      skillService.assertExists.mockResolvedValue(undefined);
      repository.setSkills.mockResolvedValue(mockJobSeeker);

      const result = await service.setSkills(id, dto);

      expect(skillService.assertExists).toHaveBeenCalledWith(dto.skillIds);
      expect(repository.setSkills).toHaveBeenCalledWith(id, skillIds, true);
      expect(result).toEqual(mockJobSeeker);
    });
  });

  describe('setLanguages', () => {
    const id: string = '123e4567-e89b-12d3-a456-426614174000';
    const dto: SetLanguagesDto = {
      languages: [
        {
          languageId: '123e4567-e89b-12d3-a456-426614174001',
          level: LanguageLevel.INTERMEDIATE,
        },
        {
          languageId: '123e4567-e89b-12d3-a456-426614174002',
          level: LanguageLevel.NATIVE,
        },
      ],
    };
    const languageIds = [
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
    ];

    it('should set languages for a job seeker', async () => {
      languageService.assertExists.mockResolvedValue(undefined);
      repository.setLanguages.mockResolvedValue(mockJobSeeker);

      const result = await service.setLanguages(id, dto);

      expect(languageService.assertExists).toHaveBeenCalledWith(languageIds);
      expect(repository.setLanguages).toHaveBeenCalledWith(
        id,
        dto.languages,
        true,
      );
      expect(result).toEqual(mockJobSeeker);
    });
  });

  describe('setContacts', () => {
    const id: string = '123e4567-e89b-12d3-a456-426614174000';
    const dto: SetContactsDto = {
      githubUrl: 'https://github.com/username',
      linkedinUrl: 'https://linkedin.com/in/username',
      telegramUrl: 'https://t.me/username',
      publicEmail: 'test@gmail.com',
      phoneNumber: '+1234567890',
    };

    it('should set contacts for a job seeker', async () => {
      repository.setContacts.mockResolvedValue(mockJobSeeker);

      const result = await service.setContacts(id, dto);

      expect(repository.setContacts).toHaveBeenCalledWith(id, dto, true);
      expect(result).toEqual(mockJobSeeker);
    });
  });
});
