import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
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
      ApiOkResponse({
        description: 'Company created',
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
            },
            name: {
              type: 'string',
              example: 'Company Name',
            },
            description: {
              type: 'string',
              example: 'Company description',
            },
            url: {
              type: 'string',
              example: 'https://company.url',
            },
            logoUrl: {
              type: 'string',
              example: 'https://company.logo/url',
            },
          },
        },
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
            properties: {
              id: {
                type: 'string',
                example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
              },
              name: {
                type: 'string',
                example: 'Company Name',
              },
              description: {
                type: 'string',
                example: 'Company description',
              },
              url: {
                type: 'string',
                example: 'https://company.url',
              },
              logoUrl: {
                type: 'string',
                example: 'https://company.logo/url',
              },
            },
          },
          example: [
            {
              id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
              name: 'Company Name',
              description: 'Company description',
              url: 'https://company.url',
              logoUrl: 'https://company.logo/url',
            },
            {
              id: '2xdb968a-ca6c-nc35-1ad9-1xdg85f4e152',
              name: 'Company Name 2',
              description: 'Company description 2',
              url: 'https://company.url-2',
              logoUrl: 'https://company.logo/url-2',
            },
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
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
            },
            name: {
              type: 'string',
              example: 'Company Name',
            },
            description: {
              type: 'string',
              example: 'Company description',
            },
            url: {
              type: 'string',
              example: 'https://company.url',
            },
            logoUrl: {
              type: 'string',
              example: 'https://company.logo/url',
            },
          },
        },
        example: {
          id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
          name: 'Company Name',
          description: 'Company description',
          url: 'https://company.url',
          logoUrl: 'https://company.logo/url',
        },
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
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
            },
            name: {
              type: 'string',
              example: 'Company Name',
            },
            description: {
              type: 'string',
              example: 'Company description',
            },
            url: {
              type: 'string',
              example: 'https://company.url',
            },
            logoUrl: {
              type: 'string',
              example: 'https://company.logo/url',
            },
          },
        },
        example: {
          id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
          name: 'Company Name',
          description: 'Company description',
          url: 'https://company.url',
          logoUrl: 'https://company.logo/url',
        },
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
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
            },
            name: {
              type: 'string',
              example: 'Company Name',
            },
            description: {
              type: 'string',
              example: 'Company description',
            },
            url: {
              type: 'string',
              example: 'https://company.url',
            },
            logoUrl: {
              type: 'string',
              example: 'https://company.logo/url',
            },
          },
        },
        example: {
          id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
          name: 'Company Name',
          description: 'Company description',
          url: 'https://company.url',
          logoUrl: 'https://company.logo/url',
        },
      }),
      ApiNotFoundResponse({ description: 'Company not found' }),
      ApiForbiddenResponse({ description: 'User is not a company' }),
      ...AuthSwagger.sessionAuthDecorators(),
    );
  }
}
