import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { accessibleBy } from '@casl/prisma';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {
  AbilityFactory,
  UserContext,
  Actions,
} from '../ability/ability.factory/ability.factory';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async create(dto: CreateDepartmentDto, user: UserContext) {
    return this.prisma.department.create({
      data: {
        name: dto.name,
      },
      include: {
        teams: true,
        employees: true,
      },
    });
  }

  async findAll(user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    const departments = await this.prisma.department.findMany({
      where: accessibleBy(ability, Actions.Read).Department,
      include: {
        teams: true,
        employees: true,
      },
    });

    return departments;
  }

  async findOne(id: number, user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    const department = await this.prisma.department.findFirst({
      where: {
        AND: [accessibleBy(ability, Actions.Read).Department, { id }],
      },
      include: {
        teams: true,
        employees: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found or access denied');
    }

    return department;
  }

  async update(id: number, dto: UpdateDepartmentDto, user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    const department = await this.prisma.department.findFirst({
      where: {
        AND: [accessibleBy(ability, Actions.Update).Department, { id }],
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found or access denied');
    }

    return this.prisma.department.update({
      where: { id },
      data: {
        name: dto.name,
      },
      include: {
        teams: true,
        employees: true,
      },
    });
  }

  async remove(id: number, user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    const department = await this.prisma.department.findFirst({
      where: {
        AND: [accessibleBy(ability, Actions.Delete).Department, { id }],
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found or access denied');
    }

    return this.prisma.department.delete({
      where: { id },
    });
  }
}
