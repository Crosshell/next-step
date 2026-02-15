import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterService } from './recruiter.service';
import { RecruiterRepository } from '../repositories/recruiter.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CompanyRole, Recruiter } from '@prisma/client';
import { CreateRecruiterDto } from '../dto/create-recruiter.dto';
import { UpdateRecruiterDto } from '../dto/update-recruiter.dto';
import { FindManyRecruitersDto } from '../dto/find-many-recruiters.dto';

describe('RecruiterService', () => {
  let service: RecruiterService;
  let repository: jest.Mocked<RecruiterRepository>;

  const mockRecruiter: Recruiter = {
    id: 'recruiter-uuid-1',
    userId: 'user-uuid-1',
    companyId: 'company-uuid-1',
    role: CompanyRole.MEMBER,
    firstName: 'First',
    lastName: 'Last',
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    setCompany: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecruiterService,
        {
          provide: RecruiterRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RecruiterService>(RecruiterService);
    repository = module.get(RecruiterRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateRecruiterDto = {
      firstName: 'First',
      lastName: 'Last',
    };
    const userId = 'user-uuid-1';

    it('should create a new recruiter', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockRecruiter);

      const result = await service.create(userId, dto);

      expect(repository.findOne).toHaveBeenCalledWith({ userId });
      expect(repository.create).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(mockRecruiter);
    });

    it('should throw BadRequestException if recruiter already exists', async () => {
      repository.findOne.mockResolvedValue(mockRecruiter);

      await expect(service.create(userId, dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findOneOrThrow', () => {
    it('should return a recruiter if found', async () => {
      repository.findOne.mockResolvedValue(mockRecruiter);

      const result = await service.findOneOrThrow({ id: mockRecruiter.id });

      expect(result).toEqual(mockRecruiter);
      expect(repository.findOne).toHaveBeenCalledWith({ id: mockRecruiter.id });
    });

    it('should throw NotFoundException if recruiter not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.findOneOrThrow({ id: mockRecruiter.id }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('setCompany', () => {
    it('should call repository.setCompany', async () => {
      const newCompanyId = 'new-company-id';
      const role = CompanyRole.ADMIN;

      repository.setCompany.mockResolvedValue({
        ...mockRecruiter,
        companyId: newCompanyId,
        role,
      });

      const result = await service.setCompany(
        { id: mockRecruiter.id },
        newCompanyId,
        role,
      );

      expect(repository.setCompany).toHaveBeenCalledWith(
        { id: mockRecruiter.id },
        newCompanyId,
        role,
      );
      expect(result.companyId).toBe(newCompanyId);
      expect(result.role).toBe(role);
    });
  });

  describe('leaveCompany', () => {
    it('should disconnect company', async () => {
      const memberRecruiter = { ...mockRecruiter, role: CompanyRole.MEMBER };
      repository.update.mockResolvedValue({
        ...memberRecruiter,
        companyId: null,
      });

      await service.leaveCompany(memberRecruiter);

      expect(repository.update).toHaveBeenCalledWith(
        { id: memberRecruiter.id },
        { company: { disconnect: true } },
      );
    });

    it('should throw ForbiddenException if recruiter is admin', async () => {
      const adminRecruiter = { ...mockRecruiter, role: CompanyRole.ADMIN };

      await expect(service.leaveCompany(adminRecruiter)).rejects.toThrow(
        ForbiddenException,
      );

      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('setRole', () => {
    it('should update recruiter role', async () => {
      const newRole = CompanyRole.ADMIN;
      repository.update.mockResolvedValue({ ...mockRecruiter, role: newRole });

      const result = await service.setRole(mockRecruiter.id, newRole);

      expect(repository.update).toHaveBeenCalledWith(
        { id: mockRecruiter.id },
        { role: newRole },
      );
      expect(result.role).toBe(newRole);
    });
  });

  describe('update', () => {
    it('should update recruiter details', async () => {
      const dto: UpdateRecruiterDto = { firstName: 'First U' };
      repository.update.mockResolvedValue({
        ...mockRecruiter,
        firstName: 'First U',
      });

      const result = await service.update(mockRecruiter.id, dto);

      expect(repository.update).toHaveBeenCalledWith(
        { id: mockRecruiter.id },
        dto,
      );
      expect(result.firstName).toBe('First U');
    });
  });

  describe('findMany', () => {
    it('should return list of recruiters', async () => {
      const dto: FindManyRecruitersDto = {
        companyId: 'company-uuid-1',
        page: 1,
        take: 10,
      };
      const recruiters = [mockRecruiter];
      repository.findMany.mockResolvedValue(recruiters);
      repository.count.mockResolvedValue(recruiters.length);

      const result = await service.findMany(dto);

      expect(repository.findMany).toHaveBeenCalledWith(
        { companyId: dto.companyId },
        { createdAt: 'desc' },
        0,
        dto.take,
      );
      expect(repository.count).toHaveBeenCalledWith({
        companyId: dto.companyId,
      });
      expect(result).toEqual({
        data: recruiters,
        meta: { total: recruiters.length, page: dto.page, totalPages: 1 },
      });
    });
  });

  describe('delete', () => {
    it('should delete recruiter', async () => {
      const recruiterNoCompany = { ...mockRecruiter, companyId: null };
      repository.delete.mockResolvedValue(recruiterNoCompany);

      await service.delete(recruiterNoCompany);

      expect(repository.update).not.toHaveBeenCalled();
      expect(repository.delete).toHaveBeenCalledWith({
        id: recruiterNoCompany.id,
      });
    });

    it('should call leaveCompany before deleting if recruiter has company', async () => {
      const memberRecruiter = { ...mockRecruiter, role: CompanyRole.MEMBER };

      repository.update.mockResolvedValue({
        ...memberRecruiter,
        companyId: null,
      });
      repository.delete.mockResolvedValue(memberRecruiter);

      await service.delete(memberRecruiter);

      expect(repository.update).toHaveBeenCalledWith(
        { id: memberRecruiter.id },
        { company: { disconnect: true } },
      );

      expect(repository.delete).toHaveBeenCalledWith({
        id: memberRecruiter.id,
      });
    });

    it('should fail to delete if recruiter is admin of a company', async () => {
      const adminRecruiter = { ...mockRecruiter, role: CompanyRole.ADMIN };

      await expect(service.delete(adminRecruiter)).rejects.toThrow(
        ForbiddenException,
      );

      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
