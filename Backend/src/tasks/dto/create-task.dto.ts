import { IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  database: string;

  @IsString()
  solution: string;
}
