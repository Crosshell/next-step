import { UnauthorizedException } from '@nestjs/common';

export class EmailNotVerifiedException extends UnauthorizedException {
  constructor() {
    super('Verify your email address first');
  }
}
