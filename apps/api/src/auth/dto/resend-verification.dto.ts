import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendVerificationDto {
  @ApiProperty({
    example: 'coolemail@gmail.com',
    description: 'Valid email address',
  })
  @IsEmail()
  email: string;
}
