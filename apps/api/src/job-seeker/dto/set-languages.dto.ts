import { ArrayUnique, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { JobSeekerLanguageDto } from './job-seeker-language.dto';

export class SetLanguagesDto {
  @IsArray()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => JobSeekerLanguageDto)
  languages: JobSeekerLanguageDto[];
}
