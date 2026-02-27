import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { accessibleBy } from '@casl/prisma';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  AbilityFactory,
  UserContext,
  Actions,
} from '../ability/ability.factory/ability.factory';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async create(dto: CreateEmployeeDto, user: UserContext) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.employee.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        careerStartDate: dto.careerStartDate
          ? new Date(dto.careerStartDate)
          : null,
        salary: dto.salary,
        role: dto.role,
        departmentId: dto.departmentId,
        reportingManagerId: dto.reportingManagerId,
      },
      include: {
        department: true,
        reportingManager: true,
      },
    });
  }

  async findAll(user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    // Get Prisma-compatible filter from CASL
    const accessibleFilter = accessibleBy(ability, Actions.Read).Employee;
    console.log(accessibleFilter);
    // Fetch employees with permissions applied
    const employees = await this.prisma.employee.findMany({
      where: accessibleFilter,
      include: {
        department: true,
        reportingManager: true,
        notes: true,
      },
    });

    return employees;
  }

  async findOne(id: number, user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    // Combine accessibleBy with specific ID
    const employee = await this.prisma.employee.findFirst({
      where: {
        AND: [accessibleBy(ability, Actions.Read).Employee, { id }],
      },
      include: {
        department: true,
        reportingManager: true,
        reports: true,
        notes: true,
        managedDepartments: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found or access denied');
    }

    return employee;
  }

  async update(id: number, dto: UpdateEmployeeDto, user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    // First check if employee exists and is accessible
    const employee = await this.prisma.employee.findFirst({
      where: {
        AND: [accessibleBy(ability, Actions.Update).Employee, { id }],
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found or access denied');
    }

    // Hash password if provided
    const hashedPassword = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

    // Update the employee
    return this.prisma.employee.update({
      where: { id },
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        careerStartDate: dto.careerStartDate
          ? new Date(dto.careerStartDate)
          : undefined,
        salary: dto.salary,
        role: dto.role,
        departmentId: dto.departmentId,
        reportingManagerId: dto.reportingManagerId,
      },
      include: {
        department: true,
        reportingManager: true,
      },
    });
  }

  async remove(id: number, user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    // Check if employee exists and is accessible for deletion
    const employee = await this.prisma.employee.findFirst({
      where: {
        AND: [accessibleBy(ability, Actions.Delete).Employee, { id }],
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found or access denied');
    }

    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
