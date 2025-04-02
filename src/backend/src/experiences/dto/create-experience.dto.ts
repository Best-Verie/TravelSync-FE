
import { IsNotEmpty, IsNumber, IsPositive, IsArray, IsString, Min, Max } from 'class-validator';

export class CreateExperienceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  duration: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  maxParticipants: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsNotEmpty()
  @IsString()
  hostId: string;
}
