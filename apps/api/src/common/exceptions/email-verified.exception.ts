import { BadRequestException } from '@nestjs/common';

export class EmailVerifiedException extends BadRequestException {
  constructor() {
    super('Email already verified');
  }
}
