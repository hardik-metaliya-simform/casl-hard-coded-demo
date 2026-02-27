import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { accessibleBy } from '@casl/prisma';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import {
  AbilityFactory,
  UserContext,
  Actions,
} from '../ability/ability.factory/ability.factory';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async create(dto: CreateTeamDto, user: UserContext) {
    return this.prisma.team.create({
      data: {
        name: dto.name,
        departmentId: dto.departmentId,
      },
      include: {
        department: true,
      },
    });
  }

  async findAll(user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    const teams = await this.prisma.team.findMany({
      where: accessibleBy(ability, Actions.Read).Team,
      include: {
        department: true,
      },
    });

    return teams;
  }

  async findOne(id: number, user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    const team = await this.prisma.team.findFirst({
      where: {
        AND: [accessibleBy(ability, Actions.Read).Team, { id }],
      },
      include: {
        department: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found or access denied');
    }

    return team;
  }

  async update(id: number, dto: UpdateTeamDto, user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    const team = await this.prisma.team.findFirst({
      where: {
        AND: [accessibleBy(ability, Actions.Update).Team, { id }],
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found or access denied');
    }

    return this.prisma.team.update({
      where: { id },
      data: {
        name: dto.name,
        departmentId: dto.departmentId,
      },
      include: {
        department: true,
      },
    });
  }

  async remove(id: number, user: UserContext) {
    const ability = this.abilityFactory.defineAbility(user);

    const team = await this.prisma.team.findFirst({
      where: {
        AND: [accessibleBy(ability, Actions.Delete).Team, { id }],
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found or access denied');
    }

    return this.prisma.team.delete({
      where: { id },
    });
  }
}
