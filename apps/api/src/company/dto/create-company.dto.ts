import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @IsOptional()
  @IsUrl()
  url?: string;
}
