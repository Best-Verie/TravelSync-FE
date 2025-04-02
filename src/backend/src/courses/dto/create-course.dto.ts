
import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  duration: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics: string[];
}
