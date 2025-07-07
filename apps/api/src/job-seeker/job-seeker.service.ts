import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { JobSeeker, Prisma } from '@prisma/client';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import {
  SubjectExistsException,
  SubjectNotFoundException,
} from '@common/exceptions';
import { SearchJobSeekerDto } from './dto/search-job-seeker.dto';
import { SetSkillsDto } from './dto/set-skills.dto';
import { SkillService } from '../skill/skill.service';

@Injectable()
export class JobSeekerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly skillService: SkillService,
  ) {}

  async create(
    createJobSeekerDto: CreateJobSeekerDto,
    userId: string,
  ): Promise<JobSeeker> {
    const existingJobSeeker = await this.findOne({ userId });

    if (existingJobSeeker) {
      throw new SubjectExistsException('Job seeker');
    }

    return this.prismaService.jobSeeker.create({
      data: {
        ...createJobSeekerDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        skills: true,
        languages: true,
        contacts: true,
      },
    });
  }

  async findOne(
    where: Prisma.JobSeekerWhereUniqueInput,
  ): Promise<JobSeeker | null> {
    return this.prismaService.jobSeeker.findUnique({
      where,
      include: {
        skills: true,
        languages: true,
        contacts: true,
      },
    });
  }

  async findMany(searchJobSeekerDto: SearchJobSeekerDto): Promise<JobSeeker[]> {
    const where: Prisma.JobSeekerWhereInput = {
      isOpenToWork: true,
    };

    if (searchJobSeekerDto.skillIds?.length) {
      where.skills = {
        some: {
          skillId: {
            in: searchJobSeekerDto.skillIds,
          },
        },
      };
    }

    if (searchJobSeekerDto.seniorityLevels?.length) {
      where.seniorityLevel = {
        in: searchJobSeekerDto.seniorityLevels,
      };
    }

    return this.prismaService.jobSeeker.findMany({
      where,
      include: {
        languages: { select: { language: true, languageLevel: true } },
        skills: { select: { skill: true } },
        contacts: true,
      },
    });
  }

  async update(
    updateJobSeekerDto: UpdateJobSeekerDto,
    where: Prisma.JobSeekerWhereUniqueInput,
  ): Promise<JobSeeker> {
    return this.prismaService.jobSeeker.update({
      where,
      data: updateJobSeekerDto,
      include: {
        languages: true,
        skills: true,
        contacts: true,
      },
    });
  }

  async setSkills(
    setSkillsDto: SetSkillsDto,
    userId: string,
  ): Promise<JobSeeker> {
    const jobSeeker = await this.findOne({ userId });

    if (!jobSeeker) {
      throw new SubjectNotFoundException('Job seeker');
    }

    await this.skillService.assertExists(setSkillsDto.skillIds);

    const data = setSkillsDto.skillIds.map((skillId) => ({
      jobSeekerId: jobSeeker.id,
      skillId,
    }));

    return this.prismaService.$transaction(async (tx) => {
      await tx.jobSeekerSkill.deleteMany({
        where: { jobSeekerId: jobSeeker.id },
      });

      await tx.jobSeekerSkill.createMany({
        data,
        skipDuplicates: true,
      });

      const result = await tx.jobSeeker.findUnique({
        where: { id: jobSeeker.id },
        include: {
          languages: true,
          skills: true,
          contacts: true,
        },
      });

      return result!;
    });
  }
}
