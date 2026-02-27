import { PartialType } from '@nestjs/mapped-types';
import { CreateManagedDepartmentDto } from './create-managed-department.dto';

export class UpdateManagedDepartmentDto extends PartialType(
  CreateManagedDepartmentDto,
) {}
