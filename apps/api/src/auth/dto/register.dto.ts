import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { UserType } from '@prisma/client';

export class RegisterDto {
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
  @Length(8, 50)
  password: string;

  @ApiProperty({
    enum: UserType,
    enumName: 'UserType',
    example: UserType.JOB_SEEKER,
    description: 'User type (JOB_SEEKER or COMPANY)',
  })
  @IsEnum(UserType)
  type: UserType;
}
