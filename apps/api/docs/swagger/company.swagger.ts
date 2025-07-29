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
import { CreateCompanyDto } from '../../src/company/dto/create-company.dto';
import { AuthSwagger } from './auth.swagger';
import { SearchCompanyDto } from '../../src/company/dto/search-company.dto';
import { UpdateCompanyDto } from '../../src/company/dto/update-company.dto';

export class CompanySwagger {
  static companyOkResponseExample = {
    id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
    name: 'Company Name',
    description: 'Company description',
    url: 'https://company.url',
    logoUrl: 'https://company.logo/url',
    isVerified: false,
    createdAt: '2025-07-29T18:40:17.097Z',
    updatedAt: '2025-07-29T18:40:17.097Z',
  };

  static companyOkResponseSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: this.companyOkResponseExample.id,
      },
      name: {
        type: 'string',
        example: this.companyOkResponseExample.name,
      },
      description: {
        type: 'string',
        example: this.companyOkResponseExample.description,
      },
      url: {
        type: 'string',
        example: this.companyOkResponseExample.url,
      },
      logoUrl: {
        type: 'string',
        example: this.companyOkResponseExample.logoUrl,
      },
      isVerified: {
        type: 'boolean',
      },
      createdAt: {
        type: 'Date',
        example: this.companyOkResponseExample.createdAt,
      },
      updatedAt: {
        type: 'Date',
        example: this.companyOkResponseExample.updatedAt,
      },
    },
  };

  static create() {
    return applyDecorators(
      ApiOperation({ summary: 'Create company' }),
      ApiBody({
        description: 'Create company data',
        type: CreateCompanyDto,
        examples: {
          company: {
            value: {
              name: 'Company Name',
              description: 'Company description',
              url: 'https://company.url',
              logoUrl: 'https://company.logo/url',
            },
          },
        },
      }),
      ApiCreatedResponse({
        description: 'Company created',
        schema: this.companyOkResponseSchema,
        example: this.companyOkResponseExample,
      }),
      ApiBadRequestResponse({ description: 'Company already exists' }),
      ApiForbiddenResponse({ description: 'User is not a company' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }

  static search() {
    return applyDecorators(
      ApiOperation({ summary: 'Search companies' }),
      ApiBody({
        description: 'Search companies data',
        type: SearchCompanyDto,
        examples: {
          company: {
            value: {
              name: 'Company Name',
              page: 4,
            },
          },
        },
      }),
      ApiOkResponse({
        description: 'Array of companies',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: this.companyOkResponseSchema.properties,
          },
          example: [
            this.companyOkResponseExample,
            this.companyOkResponseExample,
          ],
        },
      }),
    );
  }

  static getMyProfile() {
    return applyDecorators(
      ApiOperation({ summary: 'Get my company profile' }),
      ApiOkResponse({
        description: 'Company profile',
        schema: this.companyOkResponseSchema,
        example: this.companyOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Company not found' }),
      ApiForbiddenResponse({ description: 'User is not a company' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }

  static getProfile() {
    return applyDecorators(
      ApiOperation({ summary: 'Get company profile' }),
      ApiParam({
        name: 'id',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiOkResponse({
        description: 'Company profile',
        schema: this.companyOkResponseSchema,
        example: this.companyOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Company not found' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }

  static update() {
    return applyDecorators(
      ApiOperation({ summary: 'Update company profile' }),
      ApiBody({
        description: 'Update company data',
        type: UpdateCompanyDto,
        examples: {
          company: {
            value: {
              name: 'Company Name',
              description: 'Company description',
              url: 'https://company.url',
              logoUrl: 'https://company.logo/url',
            },
          },
        },
      }),
      ApiOkResponse({
        description: 'Company updated',
        schema: this.companyOkResponseSchema,
        example: this.companyOkResponseExample,
      }),
      ApiNotFoundResponse({ description: 'Company not found' }),
      ApiForbiddenResponse({ description: 'User is not a company' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }
}
