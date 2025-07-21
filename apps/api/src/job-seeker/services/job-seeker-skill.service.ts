import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JobSeeker, Prisma } from '@prisma/client';
import { SkillService } from '../../skill/skill.service';

@Injectable()
export class JobSeekerSkillService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly skillService: SkillService,
  ) {}

  async setSkills(
    jobSeekerId: string,
    skillIds: string[],
    include?: Prisma.JobSeekerInclude,
  ): Promise<JobSeeker> {
    await this.skillService.assertExists(skillIds);
    return this.prismaService.jobSeeker.update({
      where: { id: jobSeekerId },
      data: {
        skills: {
          deleteMany: {},
          createMany: {
            data: skillIds.map((skillId) => ({ skillId })),
            skipDuplicates: true,
          },
        },
      },
      include,
    });
  }
}
