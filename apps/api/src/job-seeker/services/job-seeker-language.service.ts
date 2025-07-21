import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JobSeeker, Prisma } from '@prisma/client';
import { LanguageService } from '../../language/language.service';
import { LanguageItem } from '../dto/language-item.dto';

@Injectable()
export class JobSeekerLanguageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly languageService: LanguageService,
  ) {}

  async setLanguages(
    jobSeekerId: string,
    languageItems: LanguageItem[],
    include?: Prisma.JobSeekerInclude,
  ): Promise<JobSeeker> {
    const languageIds = languageItems.map((item) => item.languageId);
    await this.languageService.assertExists(languageIds);

    const data = languageItems.map((i) => ({
      languageId: i.languageId,
      languageLevel: i.level,
    }));

    return this.prismaService.jobSeeker.update({
      where: { id: jobSeekerId },
      data: {
        languages: {
          deleteMany: { jobSeekerId },
          createMany: {
            data,
            skipDuplicates: true,
          },
        },
      },
      include,
    });
  }
}
