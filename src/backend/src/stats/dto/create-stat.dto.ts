
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateStatDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  change?: string;

  @IsOptional()
  @IsString()
  timeframe?: string;
}
