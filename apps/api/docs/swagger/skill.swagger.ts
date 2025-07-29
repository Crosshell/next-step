import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateSkillDto } from '../../src/skill/dto/create-skill.dto';

export class SkillSwagger {
  static findAll() {
    return applyDecorators(
      ApiOperation({ summary: 'Get all skills' }),
      ApiOkResponse({
        description: 'Array of skills',
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
                example: 'Nest.js',
              },
            },
          },
          example: [
            {
              id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
              name: 'Nest.js',
            },
            {
              id: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
              name: 'TypeScript',
            },
            {
              id: 'bb0a4c4f-cd55-44ff-bfd3-5539e2df74d1',
              name: 'PostgreSQL',
            },
          ],
        },
      }),
    );
  }

  static findOne() {
    return applyDecorators(
      ApiOperation({ summary: 'Get skill by id' }),
      ApiParam({
        name: 'id',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiOkResponse({
        description: 'Skill',
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
            },
            name: {
              type: 'string',
              example: 'Nest.js',
            },
          },
        },
      }),
      ApiNotFoundResponse({ description: 'Skill not found' }),
    );
  }

  static create() {
    return applyDecorators(
      ApiOperation({ summary: 'Create skill' }),
      ApiBody({
        description: 'Create skill data',
        type: CreateSkillDto,
        examples: {
          skill: {
            value: {
              name: 'Nest.js',
            },
          },
        },
      }),
      ApiOkResponse({
        description: 'Skill created',
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
            },
            name: {
              type: 'string',
              example: 'Nest.js',
            },
          },
        },
      }),
      ApiBadRequestResponse({ description: 'Skill already exists' }),
    );
  }
  static delete() {
    return applyDecorators(
      ApiOperation({ summary: 'Delete skill by id' }),
      ApiParam({
        name: 'id',
        type: 'string',
        example: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      }),
      ApiOkResponse({ description: 'Skill deleted successfully' }),
      ApiNotFoundResponse({ description: 'Skill not found' }),
    );
  }
}
