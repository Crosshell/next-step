import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateApplicationDto {
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  coverLetter?: string;

  @IsUUID()
  @IsNotEmpty()
  vacancyId: string;
}
