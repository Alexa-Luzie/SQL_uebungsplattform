import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomDatabaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  schema: string; // SQL-Schema als Text
}