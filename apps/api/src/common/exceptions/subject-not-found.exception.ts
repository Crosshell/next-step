import { BadRequestException } from '@nestjs/common';

export class SubjectNotFoundException extends BadRequestException {
  constructor(subject: string = 'subject') {
    super(`${subject} not found`);
  }
}
