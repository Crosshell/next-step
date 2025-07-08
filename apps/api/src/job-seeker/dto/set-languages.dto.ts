import { ArrayUnique, IsArray } from 'class-validator';
import { LanguageItem } from './language-item.dto';
import { Type } from 'class-transformer';

export class SetLanguagesDto {
  @IsArray()
  @ArrayUnique()
  @Type(() => LanguageItem)
  languageItems: LanguageItem[];
}
