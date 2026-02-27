import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({
    example: 'Engineering',
    description: 'Department name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
