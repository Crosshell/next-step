import { UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'coolusername@gmail.com',
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

  @ApiProperty({
    enum: UserType,
    enumName: 'UserType',
    example: UserType.JOB_SEEKER,
    description: 'User type (JOB_SEEKER or COMPANY)',
  })
  @IsEnum(UserType, { message: 'User type must be an enum UserType' })
  type: UserType;
}
