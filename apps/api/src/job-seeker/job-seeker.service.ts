import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { JobSeeker, Prisma } from '@prisma/client';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { SubjectExistsException } from '@common/exceptions';
import { SearchJobSeekerDto } from './dto/search-job-seeker.dto';

@Injectable()
export class JobSeekerService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async update(
    updateJobSeekerDto: UpdateJobSeekerDto,
    userId: string,
  ): Promise<JobSeeker> {
    return this.prismaService.jobSeeker.update({
      where: {
        userId,
      },
      data: updateJobSeekerDto,
      include: {
        languages: true,
        skills: true,
        contacts: true,
      },
    });
  }
}
