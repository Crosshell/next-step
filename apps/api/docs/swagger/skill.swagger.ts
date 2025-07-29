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
import { CreateSkillDto } from '../../src/skill/dto/create-skill.dto';
import { MessageResponse } from '@common/responses';

export class SkillSwagger {
  static skillOkResponseExample = {
    id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
    name: 'Nest.js',
  };

  static skillOkResponseSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: this.skillOkResponseExample.id,
      },
      name: {
        type: 'string',
        example: this.skillOkResponseExample.name,
      },
    },
  };

  static findAll() {
    return applyDecorators(
      ApiOperation({ summary: 'Get all skills' }),
      ApiOkResponse({
        description: 'Array of skills',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: this.skillOkResponseSchema.properties,
          },
          example: [
            this.skillOkResponseExample,
            this.skillOkResponseExample,
            this.skillOkResponseExample,
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
        schema: this.skillOkResponseSchema,
        example: this.skillOkResponseExample,
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
      ApiCreatedResponse({
        description: 'Skill created',
        schema: this.skillOkResponseSchema,
        example: this.skillOkResponseExample,
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
      ApiOkResponse({
        description: 'Skill deleted successfully',
        type: MessageResponse,
      }),
      ApiNotFoundResponse({ description: 'Skill not found' }),
    );
  }
}
