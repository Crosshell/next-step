import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { UserType } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 50, {
    message: 'Password must be between 8 and 50 characters',
  })
  password: string;

  @IsEnum(UserType, { message: 'User type must be an enum UserType' })
  type: UserType;
}
