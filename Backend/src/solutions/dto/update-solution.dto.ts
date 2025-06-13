import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdateSolutionDto {
  @IsOptional()
  @IsString()
  solutionQuery?: string;

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;
}