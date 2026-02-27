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
import { ManagedDepartmentService } from './managed-department.service';
import { CreateManagedDepartmentDto } from './dto/create-managed-department.dto';
import { UpdateManagedDepartmentDto } from './dto/update-managed-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AbilityGuard } from '../common/guards/ability.guard';
import { CheckAbility } from '../common/decorators/check-ability.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Actions } from '../ability/ability.factory/ability.factory';
import type { UserContext } from '../ability/ability.factory/ability.factory';

@ApiTags('managed-departments')
@ApiBearerAuth('JWT-auth')
@Controller('managed-departments')
@UseGuards(JwtAuthGuard, AbilityGuard)
export class ManagedDepartmentController {
  constructor(
    private readonly managedDepartmentService: ManagedDepartmentService,
  ) {}

  @Post()
  @CheckAbility({ action: Actions.Manage, subject: 'all' })
  @ApiOperation({
    summary: 'Assign a Team Manager to a department',
    description:
      'Creates a relationship between a TM and a department they manage',
  })
  @ApiResponse({
    status: 201,
    description: 'Department assignment successfully created',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createManagedDepartmentDto: CreateManagedDepartmentDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.managedDepartmentService.create(
      createManagedDepartmentDto,
      user,
    );
  }

  @Get()
  @CheckAbility({ action: Actions.Manage, subject: 'all' })
  @ApiOperation({
    summary: 'Get all managed departments (filtered by permissions)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of accessible managed departments',
  })
  findAll(@CurrentUser() user: UserContext) {
    return this.managedDepartmentService.findAll(user);
  }

  @Get(':id')
  @CheckAbility({ action: Actions.Manage, subject: 'all' })
  @ApiOperation({ summary: 'Get managed department by ID' })
  @ApiResponse({ status: 200, description: 'Managed department details' })
  @ApiResponse({
    status: 404,
    description: 'Managed department not found or access denied',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserContext,
  ) {
    return this.managedDepartmentService.findOne(id, user);
  }

  @Patch(':id')
  @CheckAbility({ action: Actions.Manage, subject: 'all' })
  @ApiOperation({ summary: 'Update managed department' })
  @ApiResponse({
    status: 200,
    description: 'Managed department successfully updated',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Managed department not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManagedDepartmentDto: UpdateManagedDepartmentDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.managedDepartmentService.update(
      id,
      updateManagedDepartmentDto,
      user,
    );
  }

  @Delete(':id')
  @CheckAbility({ action: Actions.Manage, subject: 'all' })
  @ApiOperation({ summary: 'Delete managed department' })
  @ApiResponse({
    status: 200,
    description: 'Managed department successfully deleted',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Managed department not found' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserContext,
  ) {
    return this.managedDepartmentService.remove(id, user);
  }
}
