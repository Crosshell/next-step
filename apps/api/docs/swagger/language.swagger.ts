import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateLanguageDto } from '../../src/language/dto/create-language.dto';
import { MessageResponse } from '@common/responses';

export class LanguageSwagger {
  static languageOkResponseExample = {
    id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
    name: 'English',
  };

  static languageOkResponseSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', example: this.languageOkResponseExample.id },
      name: {
        type: 'string',
        example: this.languageOkResponseExample.name,
      },
    },
  };

  static findAll() {
    return applyDecorators(
      ApiOperation({ summary: 'Get all languages' }),
      ApiOkResponse({
        description: 'Array of languages',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: this.languageOkResponseSchema.properties,
          },
        },
        example: [
          this.languageOkResponseExample,
          this.languageOkResponseExample,
          this.languageOkResponseExample,
        ],
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
        schema: this.languageOkResponseSchema,
        example: this.languageOkResponseExample,
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
      ApiCreatedResponse({
        description: 'Language created',
        schema: this.languageOkResponseSchema,
        example: this.languageOkResponseExample,
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
      ApiOkResponse({
        description: 'Language deleted successfully',
        type: MessageResponse,
      }),
      ApiNotFoundResponse({ description: 'Language not found' }),
    );
  }
}
