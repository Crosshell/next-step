import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'coolemail@gmail.com',
    description: 'Valid email address',
  })
  @IsEmail()
  email: string;
}
