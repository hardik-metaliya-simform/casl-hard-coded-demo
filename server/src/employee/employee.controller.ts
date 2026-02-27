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
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AbilityGuard } from '../common/guards/ability.guard';
import { CheckAbility } from '../common/decorators/check-ability.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Actions } from '../ability/ability.factory/ability.factory';
import type { UserContext } from '../ability/ability.factory/ability.factory';

@ApiTags('employees')
@ApiBearerAuth('JWT-auth')
@Controller('employees')
@UseGuards(JwtAuthGuard, AbilityGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @CheckAbility({ action: Actions.Create, subject: 'Employee' })
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: 201, description: 'Employee successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.employeeService.create(createEmployeeDto, user);
  }

  @Get()
  @CheckAbility({ action: Actions.Read, subject: 'Employee' })
  @ApiOperation({ summary: 'Get all employees (filtered by permissions)' })
  @ApiResponse({ status: 200, description: 'List of accessible employees' })
  findAll(@CurrentUser() user: UserContext) {
    return this.employeeService.findAll(user);
  }

  @Get(':id')
  @CheckAbility({ action: Actions.Read, subject: 'Employee' })
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiResponse({ status: 200, description: 'Employee details' })
  @ApiResponse({
    status: 404,
    description: 'Employee not found or access denied',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserContext,
  ) {
    return this.employeeService.findOne(id, user);
  }

  @Patch(':id')
  @CheckAbility({ action: Actions.Update, subject: 'Employee' })
  @ApiOperation({ summary: 'Update employee' })
  @ApiResponse({ status: 200, description: 'Employee successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.employeeService.update(id, updateEmployeeDto, user);
  }

  @Delete(':id')
  @CheckAbility({ action: Actions.Delete, subject: 'Employee' })
  @ApiOperation({ summary: 'Delete employee' })
  @ApiResponse({ status: 200, description: 'Employee successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserContext,
  ) {
    return this.employeeService.remove(id, user);
  }
}
