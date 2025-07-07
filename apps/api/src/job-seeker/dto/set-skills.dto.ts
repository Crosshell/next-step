import { IsArray, IsUUID } from 'class-validator';

export class SetSkillsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  skillIds: string[];
}
