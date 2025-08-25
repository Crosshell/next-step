import { ApplicationStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class SetStatusDto {
  @IsNotEmpty()
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
