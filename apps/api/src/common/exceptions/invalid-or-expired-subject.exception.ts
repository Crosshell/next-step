import { UnauthorizedException } from '@nestjs/common';

export class InvalidOrExpiredSubjectException extends UnauthorizedException {
  constructor(subject: string = 'subject') {
    super(`Invalid or expired ${subject}`);
  }
}
