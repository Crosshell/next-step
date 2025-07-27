import { ArrayNotEmpty, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class SetSkillsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  requiredSkillIds: string[];
}
