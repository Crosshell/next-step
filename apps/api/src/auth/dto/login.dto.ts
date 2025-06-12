import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'coolemail@gmail.com',
    description: 'Valid email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'verySTRONGPassword6555',
    minLength: 8,
    maxLength: 50,
  })
  @IsString()
  @Length(8, 50, {
    message: 'Password must be between 8 and 50 characters',
  })
  password: string;
}
