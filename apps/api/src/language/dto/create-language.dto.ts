import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;
}
