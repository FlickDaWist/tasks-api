import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @IsBoolean()
  isDone: boolean;
}
