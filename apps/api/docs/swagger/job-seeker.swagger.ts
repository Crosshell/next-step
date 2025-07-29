import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateJobSeekerDto } from '../../src/job-seeker/dto/create-job-seeker.dto';
import { AuthSwagger } from './auth.swagger';
import { SearchJobSeekerDto } from '../../src/job-seeker/dto/search-job-seeker.dto';
import { UpdateJobSeekerDto } from '../../src/job-seeker/dto/update-job-seeker.dto';
import { SetSkillsDto } from '../../src/job-seeker/dto/set-skills.dto';
import { SetLanguagesDto } from '../../src/job-seeker/dto/set-languages.dto';
import { LanguageSwagger } from './language.swagger';
import { SkillSwagger } from './skill.swagger';

export class JobSeekerSwagger {
  static jobSeekerOkResponseExample = {
    id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
    firstName: 'First Name',
    lastName: 'Last Name',
    location: 'Hostel 8',
    bio: 'bio',
    avatarUrl: 'https://job-seeker/avatar-url',
    expectedSalary: 1300,
    dateOfBirth: '2025-07-29',
    isOpenToWork: true,
    seniorityLevel: 'MIDDLE',
    languages: [
      {
        level: 'INTERMEDIATE',
        language: LanguageSwagger.languageOkResponseExample,
      },
      {
        level: 'NATIVE',
        language: LanguageSwagger.languageOkResponseExample,
      },
    ],
    skills: [
      {
        skill: SkillSwagger.skillOkResponseExample,
      },
      {
        skill: SkillSwagger.skillOkResponseExample,
      },
    ],
    contacts: null,
    createdAt: '2025-07-29T17:11:23.567Z',
    updatedAt: '2025-07-29T17:11:23.567Z',
  };

  static jobSeekerOkResponseSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', example: this.jobSeekerOkResponseExample.id },
      firstName: {
        type: 'string',
        example: this.jobSeekerOkResponseExample.firstName,
      },
      lastName: {
        type: 'string',
        example: this.jobSeekerOkResponseExample.lastName,
      },
      location: {
        type: 'string',
        example: this.jobSeekerOkResponseExample.location,
      },
      bio: { type: 'string', example: this.jobSeekerOkResponseExample.bio },
      avatarUrl: {
        type: 'string',
        example: this.jobSeekerOkResponseExample.avatarUrl,
      },
      expectedSalary: {
        type: 'number',
        example: this.jobSeekerOkResponseExample.expectedSalary,
      },
      dateOfBirth: {
        type: 'Date',
        example: this.jobSeekerOkResponseExample.dateOfBirth,
      },
      isOpenToWork: {
        type: 'boolean',
        example: this.jobSeekerOkResponseExample.isOpenToWork,
      },
      seniorityLevel: {
        type: 'string',
        example: this.jobSeekerOkResponseExample.seniorityLevel,
      },
      languages: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            level: { type: 'string', example: 'INTERMEDIATE' },
            language: LanguageSwagger.languageOkResponseSchema,
          },
        },
        example: this.jobSeekerOkResponseExample.languages,
      },
      skills: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            skill: SkillSwagger.skillOkResponseSchema,
          },
        },
        example: this.jobSeekerOkResponseExample.skills,
      },
      contacts: {
        type: 'object',
        example: this.jobSeekerOkResponseExample.contacts,
      },
      createdAt: {
        type: 'Date',
        example: this.jobSeekerOkResponseExample.createdAt,
      },
      updatedAt: {
        type: 'Date',
        example: this.jobSeekerOkResponseExample.updatedAt,
      },
    },
  };

  static create() {
    return applyDecorators(
      ApiOperation({ summary: 'Create job seeker profile' }),
      ApiBody({
        description: 'Create job seeker data',
        type: CreateJobSeekerDto,
        examples: {
          jobSeeker: {
            value: {
              firstName: 'First Name',
              lastName: 'Last Name',
              location: 'Hostel 8',
              bio: 'bio',
              avatarUrl: 'https://job-seeker/avatar-url',
              expectedSalary: 1300,
              dateOfBirth: '2025-07-29',
              isOpenToWork: true,
              seniorityLevel: 'MIDDLE',
            },
          },
        },
      }),
      ApiCreatedResponse({
        description: 'Job seeker created',
        schema: this.jobSeekerOkResponseSchema,
        example: this.jobSeekerOkResponseExample,
      }),
      ApiBadRequestResponse({ description: 'Job seeker already exists' }),
      ApiForbiddenResponse({ description: 'User is not a job seeker' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }

  static getMyProfile() {
    return applyDecorators(
      ApiOperation({ summary: 'Get my job seeker profile' }),
      ApiOkResponse({
        description: 'Job seeker profile',
        schema: this.jobSeekerOkResponseSchema,
        example: this.jobSeekerOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Job seeker not found' }),
      ApiForbiddenResponse({ description: 'User is not a job seeker' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }

  static getProfile() {
    return applyDecorators(
      ApiOperation({ summary: 'Get job seeker profile' }),
      ApiParam({
        name: 'id',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiOkResponse({
        description: 'Job seeker profile',
        schema: this.jobSeekerOkResponseSchema,
        example: this.jobSeekerOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Job seeker not found' }),
      ApiForbiddenResponse({
        description: 'User is not a company / Company profile not found',
      }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }

  static search() {
    return applyDecorators(
      ApiOperation({ summary: 'Search job seekers' }),
      ApiBody({
        description: 'Search job seeker data',
        type: SearchJobSeekerDto,
        examples: {
          search: {
            value: {
              languages: [
                {
                  languageId: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
                  level: 'NATIVE',
                },
                {
                  languageId: '7av7132r-723d-9npo-oa24-2xue5ei6u152',
                  level: 'NATIVE',
                },
              ],
              skillIds: [
                '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
                '7av7132r-723d-9npo-oa24-2xue5ei6u152',
              ],
              seniorityLevels: ['MIDDLE', 'SENIOR'],
              orderBy: {
                expectedSalary: 'asc',
              },
              page: 3,
            },
          },
        },
      }),
      ApiOkResponse({
        description: 'Array of job seekers',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: this.jobSeekerOkResponseSchema.properties,
          },
        },
        example: [
          this.jobSeekerOkResponseExample,
          this.jobSeekerOkResponseExample,
          this.jobSeekerOkResponseExample,
        ],
      }),
      ApiForbiddenResponse({
        description: 'User is not a company / Company profile not found',
      }),
      ApiBadRequestResponse({
        description: 'Skill not found / Language not found',
      }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }

  static update() {
    return applyDecorators(
      ApiOperation({ summary: 'Update job seeker profile' }),
      ApiBody({
        description: 'Update job seeker data',
        type: UpdateJobSeekerDto,
        examples: {
          jobSeeker: {
            value: {
              firstName: 'First Name',
              lastName: 'Last Name',
              location: 'Hostel 8',
              bio: 'bio',
              avatarUrl: 'https://job-seeker/avatar-url',
              expectedSalary: 1300,
              dateOfBirth: '2025-07-29',
              isOpenToWork: true,
              seniorityLevel: 'MIDDLE',
            },
          },
        },
      }),
      ApiOkResponse({
        description: 'Job seeker updated',
        schema: this.jobSeekerOkResponseSchema,
        example: this.jobSeekerOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Job seeker not found' }),
      ApiForbiddenResponse({ description: 'User is not a job seeker' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }

  static setSkills() {
    return applyDecorators(
      ApiOperation({ summary: "Set job seeker's skills" }),
      ApiBody({
        description: "Set job seeker's skills data",
        type: SetSkillsDto,
        examples: {
          skills: {
            value: {
              skillIds: [
                '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
                '7av7132r-723d-9npo-oa24-2xue5ei6u152',
              ],
            },
          },
        },
      }),
      ApiOkResponse({
        description: 'Job seeker skills updated',
        schema: this.jobSeekerOkResponseSchema,
        example: this.jobSeekerOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Job seeker not found' }),
      ApiForbiddenResponse({ description: 'User is not a job seeker' }),
      ApiBadRequestResponse({ description: 'Skill not found' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }

  static setLanguages() {
    return applyDecorators(
      ApiOperation({ description: "Set job seeker's languages" }),
      ApiBody({
        description: "Set job seeker's languages data",
        type: SetLanguagesDto,
        examples: {
          languages: {
            value: {
              languages: [
                {
                  languageId: 'c386091e-5c7f-4fb4-a248-b77d23c4873b',
                  level: 'INTERMEDIATE',
                },
                {
                  languageId: 'b72340be-4044-4d1d-9a7e-8bc507aafc94',
                  level: 'NATIVE',
                },
              ],
            },
          },
        },
      }),
      ApiOkResponse({
        description: 'Job seeker languages updated',
        schema: this.jobSeekerOkResponseSchema,
        example: this.jobSeekerOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Job seeker not found' }),
      ApiForbiddenResponse({ description: 'User is not a job seeker' }),
      ApiBadRequestResponse({ description: 'Language not found' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }
}
