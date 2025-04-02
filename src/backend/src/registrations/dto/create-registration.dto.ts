
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRegistrationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  programType: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  message?: string;
}
