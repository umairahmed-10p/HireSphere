import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum JobStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  IN_PROGRESS = 'IN_PROGRESS',
  FILLED = 'FILLED',
  CANCELLED = 'CANCELLED'
}

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  company: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  hiringManager?: string;

  @IsOptional()
  @IsString()
  team?: string;

  @IsString()
  userId: string;
}
