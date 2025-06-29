import { BadRequestException } from '@nestjs/common';

export class InvalidOrExpiredSubjectException extends BadRequestException {
  constructor(subject: string = 'subject') {
    super(`Invalid or expired ${subject}`);
  }
}
