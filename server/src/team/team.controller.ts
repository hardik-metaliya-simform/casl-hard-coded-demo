import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AbilityGuard } from '../common/guards/ability.guard';
import { CheckAbility } from '../common/decorators/check-ability.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Actions } from '../ability/ability.factory/ability.factory';
import type { UserContext } from '../ability/ability.factory/ability.factory';

@ApiTags('teams')
@ApiBearerAuth('JWT-auth')
@Controller('teams')
@UseGuards(JwtAuthGuard, AbilityGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @CheckAbility({ action: Actions.Create, subject: 'Team' })
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'Team successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createTeamDto: CreateTeamDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.teamService.create(createTeamDto, user);
  }

  @Get()
  @CheckAbility({ action: Actions.Read, subject: 'Team' })
  @ApiOperation({ summary: 'Get all teams (filtered by permissions)' })
  @ApiResponse({ status: 200, description: 'List of accessible teams' })
  findAll(@CurrentUser() user: UserContext) {
    return this.teamService.findAll(user);
  }

  @Get(':id')
  @CheckAbility({ action: Actions.Read, subject: 'Team' })
  @ApiOperation({ summary: 'Get team by ID' })
  @ApiResponse({ status: 200, description: 'Team details' })
  @ApiResponse({ status: 404, description: 'Team not found or access denied' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserContext,
  ) {
    return this.teamService.findOne(id, user);
  }

  @Patch(':id')
  @CheckAbility({ action: Actions.Update, subject: 'Team' })
  @ApiOperation({ summary: 'Update team' })
  @ApiResponse({ status: 200, description: 'Team successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: UpdateTeamDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.teamService.update(id, updateTeamDto, user);
  }

  @Delete(':id')
  @CheckAbility({ action: Actions.Delete, subject: 'Team' })
  @ApiOperation({ summary: 'Delete team' })
  @ApiResponse({ status: 200, description: 'Team successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserContext,
  ) {
    return this.teamService.remove(id, user);
  }
}
