import { BadRequestException } from '@nestjs/common';

export class SubjectExistsException extends BadRequestException {
  constructor(subject: string = 'subject') {
    super(`${subject} already exists`);
  }
}
