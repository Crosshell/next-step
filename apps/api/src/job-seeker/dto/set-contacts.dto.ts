import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsUrl,
  Matches,
} from 'class-validator';

export class SetContactsDto {
  @IsOptional()
  @IsUrl()
  @Matches(/^https:\/\/github\.com\/.+$/)
  githubUrl?: string;

  @IsOptional()
  @IsUrl()
  @Matches(/^https:\/\/www\.linkedin\.com\/in\/.+$/)
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl()
  @Matches(/^https:\/\/t\.me\/.+$/)
  telegramUrl?: string;

  @IsOptional()
  @IsEmail()
  publicEmail?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
