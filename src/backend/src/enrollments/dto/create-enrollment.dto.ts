
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;
}
