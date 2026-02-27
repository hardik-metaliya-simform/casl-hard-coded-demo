import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({
    example: 'Employee showed great performance this quarter',
    description: 'Note content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether this note is only visible to TM and CTO',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isAdminOnly?: boolean;

  @ApiProperty({
    example: 1,
    description: 'Employee ID this note is about',
  })
  @IsInt()
  employeeId: number;
}
