
import { IsNotEmpty, IsNumber, IsPositive, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  experienceId: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  participants: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsNotEmpty()
  @IsString()
  status: string;
  
  @IsOptional()
  @IsString()
  paymentId?: string;
  
  // Removed the notes field as it's not in the Prisma schema
}
