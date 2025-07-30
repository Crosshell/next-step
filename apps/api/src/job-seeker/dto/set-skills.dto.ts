import { ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class SetSkillsDto {
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  skillIds: string[];
}
