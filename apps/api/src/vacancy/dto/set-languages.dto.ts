import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VacancyLanguageDto } from './vacancy-language.dto';

export class SetLanguagesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => VacancyLanguageDto)
  requiredLanguages: VacancyLanguageDto[];
}
