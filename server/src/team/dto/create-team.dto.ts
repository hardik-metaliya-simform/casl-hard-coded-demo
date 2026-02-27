import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    example: 'Backend Team',
    description: 'Team name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'Department ID this team belongs to',
  })
  @IsInt()
  departmentId: number;
}
