import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateLanguageDto } from '../../src/language/dto/create-language.dto';

export class LanguageSwagger {
  static findAll() {
    return applyDecorators(
      ApiOperation({ summary: 'Get all languages' }),
      ApiOkResponse({
        description: 'Array of languages',
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
                example: 'English',
              },
            },
          },
          example: [
            {
              id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
              name: 'English',
            },
            {
              id: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
              name: 'Spanish',
            },
            {
              id: 'bb0a4c4f-cd55-44ff-bfd3-5539e2df74d1',
              name: 'French',
            },
          ],
        },
      }),
    );
  }

  static findOne() {
    return applyDecorators(
      ApiOperation({ summary: 'Get language by id' }),
      ApiParam({
        name: 'id',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiOkResponse({
        description: 'Language',
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
            },
            name: {
              type: 'string',
              example: 'English',
            },
          },
        },
      }),
      ApiNotFoundResponse({ description: 'Language not found' }),
    );
  }

  static create() {
    return applyDecorators(
      ApiOperation({ summary: 'Create language' }),
      ApiBody({
        description: 'Create language data',
        type: CreateLanguageDto,
        examples: {
          language: {
            value: {
              name: 'English',
            },
          },
        },
      }),
      ApiOkResponse({
        description: 'Language created',
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
            },
            name: {
              type: 'string',
              example: 'English',
            },
          },
        },
      }),
      ApiBadRequestResponse({ description: 'Language already exists' }),
    );
  }

  static delete() {
    return applyDecorators(
      ApiOperation({ summary: 'Delete language by id' }),
      ApiParam({
        name: 'id',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiOkResponse({ description: 'Language deleted successfully' }),
      ApiNotFoundResponse({ description: 'Language not found' }),
    );
  }
}
