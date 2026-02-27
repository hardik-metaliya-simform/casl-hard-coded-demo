import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AbilityModule } from './ability/ability.module';
import { EmployeeModule } from './employee/employee.module';
import { DepartmentModule } from './department/department.module';
import { TeamModule } from './team/team.module';
import { NoteModule } from './note/note.module';
import { ManagedDepartmentModule } from './managed-department/managed-department.module';

@Module({
  imports: [
    PrismaModule,
    AbilityModule,
    AuthModule,
    EmployeeModule,
    DepartmentModule,
    TeamModule,
    NoteModule,
    ManagedDepartmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
