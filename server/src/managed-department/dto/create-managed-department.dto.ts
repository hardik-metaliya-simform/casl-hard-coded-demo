import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManagedDepartmentDto {
  @ApiProperty({
    example: 1,
    description: 'Employee ID (typically a TM)',
  })
  @IsInt()
  employeeId: number;

  @ApiProperty({
    example: 1,
    description: 'Department ID to be managed',
  })
  @IsInt()
  departmentId: number;
}
