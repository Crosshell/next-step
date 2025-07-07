import { CreateJobSeekerDto } from './create-job-seeker.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateJobSeekerDto extends PartialType(CreateJobSeekerDto) {}
