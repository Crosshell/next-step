import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { UserType } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 50)
  password: string;

  @IsEnum(UserType)
  type: UserType;
}
