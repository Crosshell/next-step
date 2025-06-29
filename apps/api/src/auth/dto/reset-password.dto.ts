import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
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
