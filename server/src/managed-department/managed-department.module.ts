import { Module } from '@nestjs/common';
import { ManagedDepartmentService } from './managed-department.service';
import { ManagedDepartmentController } from './managed-department.controller';

@Module({
  controllers: [ManagedDepartmentController],
  providers: [ManagedDepartmentService],
  exports: [ManagedDepartmentService],
})
export class ManagedDepartmentModule {}
