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
import { CreateVacancyDto } from '../../src/vacancy/dto/create-vacancy.dto';
import { CompanySwagger } from './company.swagger';
import { LanguageSwagger } from './language.swagger';
import { SkillSwagger } from './skill.swagger';
import { AuthSwagger } from './auth.swagger';
import { SearchVacancyDto } from '../../src/vacancy/dto/search-vacancy.dto';
import { UpdateVacancyDto } from '../../src/vacancy/dto/update-vacancy.dto';
import { MessageResponse } from '@common/responses';
import { SetSkillsDto } from '../../src/vacancy/dto/set-skills.dto';
import { SetLanguagesDto } from '../../src/vacancy/dto/set-languages.dto';

export class VacancySwagger {
  static vacancyOkResponseExample = {
    title: 'Ex title',
    description: 'Ex description',
    salaryMin: 100,
    salaryMax: 500,
    officeLocation: 'Hostel number 8',
    experienceRequired: 7,
    isActive: true,
    workFormat: ['OFFICE', 'REMOTE', 'HYBRID'],
    employmentType: ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'],
    seniorityLevel: 'MIDDLE',
    requiredSkills: [
      {
        skill: SkillSwagger.skillOkResponseExample,
      },
      {
        skill: SkillSwagger.skillOkResponseExample,
      },
    ],
    requiredLanguages: [
      {
        level: 'INTERMEDIATE',
        language: LanguageSwagger.languageOkResponseExample,
      },
      {
        level: 'NATIVE',
        language: LanguageSwagger.languageOkResponseExample,
      },
    ],
    company: CompanySwagger.companyOkResponseExample,
    createdAt: '2025-07-29T18:40:22.800Z',
    updatedAt: '2025-07-29T18:40:22.800Z',
  };

  static vacancyOkResponseSchema = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: this.vacancyOkResponseExample.title,
      },
      description: {
        type: 'string',
        example: this.vacancyOkResponseExample.description,
      },
      salaryMin: {
        type: 'number',
        example: this.vacancyOkResponseExample.salaryMin,
      },
      salaryMax: {
        type: 'number',
        example: this.vacancyOkResponseExample.salaryMax,
      },
      officeLocation: {
        type: 'string',
        example: this.vacancyOkResponseExample.officeLocation,
      },
      experienceRequired: {
        type: 'number',
        example: this.vacancyOkResponseExample.experienceRequired,
      },
      isActive: {
        type: 'boolean',
        example: this.vacancyOkResponseExample.isActive,
      },
      workFormat: {
        type: 'array',
        items: {
          type: 'string',
          example: this.vacancyOkResponseExample.workFormat,
        },
      },
      employmentType: {
        type: 'array',
        items: {
          type: 'string',
          example: this.vacancyOkResponseExample.employmentType,
        },
      },
      seniorityLevel: {
        type: 'string',
        example: this.vacancyOkResponseExample.seniorityLevel,
      },
      requiredSkills: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            skill: SkillSwagger.skillOkResponseSchema,
          },
        },
      },
      requiredLanguages: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            level: { type: 'string', example: 'INTERMEDIATE' },
            language: LanguageSwagger.languageOkResponseSchema,
          },
        },
      },
      company: {
        type: 'object',
        properties: CompanySwagger.companyOkResponseSchema.properties,
      },
      createdAt: {
        type: 'Date',
        example: this.vacancyOkResponseExample.createdAt,
      },
      updatedAt: {
        type: 'Date',
        example: this.vacancyOkResponseExample.updatedAt,
      },
    },
  };

  static create() {
    return applyDecorators(
      ApiOperation({ summary: 'Create vacancy' }),
      ApiBody({
        description: 'Create vacancy data',
        type: CreateVacancyDto,
        examples: {
          vacancy: {
            value: {
              title: 'Ex title',
              description: 'Ex description',
              salaryMin: 100,
              salaryMax: 500,
              officeLocation: 'Hostel number 8',
              experienceRequired: 7,
              isActive: true,
              workFormat: ['OFFICE', 'REMOTE', 'HYBRID'],
              employmentType: [
                'FULL_TIME',
                'PART_TIME',
                'INTERNSHIP',
                'CONTRACT',
              ],
              seniorityLevel: 'MIDDLE',
            },
          },
        },
      }),
      ApiCreatedResponse({
        description: 'Vacancy created',
        schema: this.vacancyOkResponseSchema,
        example: this.vacancyOkResponseExample,
      }),
      ApiForbiddenResponse({
        description: 'User is not a company / Company profile not found',
      }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }

  static getMyVacancies() {
    return applyDecorators(
      ApiOperation({ summary: 'Get my vacancies' }),
      ApiOkResponse({
        description: 'Array of vacancies',
        schema: this.vacancyOkResponseSchema,
        example: this.vacancyOkResponseExample,
      }),
      ApiForbiddenResponse({
        description: 'User is not a company / Company profile not found',
      }),
      ApiBadRequestResponse({ description: 'Company not found' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }

  static search() {
    return applyDecorators(
      ApiOperation({ summary: 'Search vacancies' }),
      ApiBody({
        description: 'Search vacancies data',
        type: SearchVacancyDto,
        examples: {
          search: {
            value: {
              title: 'Vacancy title',
              salaryMin: 100,
              experienceRequired: 5,
              workFormats: ['OFFICE', 'REMOTE', 'HYBRID'],
              employmentTypes: [
                'FULL_TIME',
                'PART_TIME',
                'INTERNSHIP',
                'CONTRACT',
              ],
              seniorityLevel: 'MIDDLE',
              requiredLanguages: [
                {
                  languageId: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
                  level: 'NATIVE',
                },
                {
                  languageId: '7av7132r-723d-9npo-oa24-2xue5ei6u152',
                  level: 'NATIVE',
                },
              ],
              requiredSkillIds: [
                '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
                '7av7132r-723d-9npo-oa24-2xue5ei6u152',
              ],
              orderBy: { salaryMin: 'asc' },
              page: 3,
            },
          },
        },
      }),
      ApiOkResponse({
        description: 'Array of vacancies',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: this.vacancyOkResponseSchema.properties,
          },
        },
        example: [
          this.vacancyOkResponseExample,
          this.vacancyOkResponseExample,
          this.vacancyOkResponseExample,
        ],
      }),
    );
  }

  static getByCompany() {
    return applyDecorators(
      ApiOperation({ summary: 'Get vacancies by company id' }),
      ApiParam({
        name: 'companyId',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiOkResponse({
        description: 'Array of vacancies',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: this.vacancyOkResponseSchema.properties,
            example: [
              this.vacancyOkResponseExample,
              this.vacancyOkResponseExample,
              this.vacancyOkResponseExample,
            ],
          },
        },
      }),
      ApiBadRequestResponse({ description: 'Company not found' }),
    );
  }

  static findOne() {
    return applyDecorators(
      ApiOperation({ summary: 'Get vacancy by id' }),
      ApiParam({
        name: 'id',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiOkResponse({
        description: 'Vacancy',
        schema: this.vacancyOkResponseSchema,
        example: this.vacancyOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Vacancy not found' }),
    );
  }

  static update() {
    return applyDecorators(
      ApiOperation({ description: 'Update vacancy' }),
      ApiParam({
        name: 'id',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiBody({
        description: 'Update vacancy data',
        type: UpdateVacancyDto,
        examples: {
          vacancy: {
            value: {
              title: 'Ex title',
              description: 'Ex description',
              salaryMin: 100,
              salaryMax: 500,
              officeLocation: 'Hostel number 8',
              experienceRequired: 7,
              isActive: true,
              workFormat: ['OFFICE', 'REMOTE', 'HYBRID'],
              employmentType: [
                'FULL_TIME',
                'PART_TIME',
                'INTERNSHIP',
                'CONTRACT',
              ],
              seniorityLevel: 'MIDDLE',
            },
          },
        },
      }),
      ApiOkResponse({
        description: 'Vacancy updated',
        schema: this.vacancyOkResponseSchema,
        example: this.vacancyOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Vacancy not found' }),
      ApiForbiddenResponse({
        description:
          'User is not a company / Company profile not found / Vacancy id not found / You are not the owner of this vacancy',
      }),
    );
  }

  static delete() {
    return applyDecorators(
      ApiOperation({ description: 'Delete vacancy' }),
      ApiParam({
        name: 'id',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiOkResponse({
        description: 'Vacancy deleted successfully',
        type: MessageResponse,
      }),
      ApiNotFoundResponse({ description: 'Vacancy not found' }),
      ApiForbiddenResponse({
        description:
          'User is not a company / Company profile not found / Vacancy id not found / You are not the owner of this vacancy',
      }),
    );
  }

  static setRequiredSkills() {
    return applyDecorators(
      ApiOperation({ description: 'Set required skills for vacancy' }),
      ApiParam({
        name: 'id',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiBody({
        description: 'Set required skills data',
        type: SetSkillsDto,
        examples: {
          skills: {
            value: {
              requiredSkillIds: [
                '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
                '7av7132r-723d-9npo-oa24-2xue5ei6u152',
              ],
            },
          },
        },
      }),
      ApiOkResponse({
        description: 'Vacancy required skills updated',
        schema: this.vacancyOkResponseSchema,
        example: this.vacancyOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Vacancy not found' }),
      ApiForbiddenResponse({
        description:
          'User is not a company / Company profile not found / Vacancy id not found / You are not the owner of this vacancy',
      }),
    );
  }

  static setRequiredLanguages() {
    return applyDecorators(
      ApiOperation({ description: 'Set required languages for vacancy' }),
      ApiParam({
        name: 'id',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiBody({
        description: 'Set required skills data',
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
        description: 'Vacancy required languages updated',
        schema: this.vacancyOkResponseSchema,
        example: this.vacancyOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Vacancy not found' }),
      ApiForbiddenResponse({
        description:
          'User is not a company / Company profile not found / Vacancy id not found / You are not the owner of this vacancy',
      }),
    );
  }
}
