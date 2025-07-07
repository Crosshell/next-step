import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;
}
