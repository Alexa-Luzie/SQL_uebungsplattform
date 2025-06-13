import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CreateSolutionDto {
  @IsNotEmpty()
  @IsString()
  taskId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  solutionQuery: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;
}