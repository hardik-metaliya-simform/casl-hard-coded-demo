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
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AbilityGuard } from '../common/guards/ability.guard';
import { CheckAbility } from '../common/decorators/check-ability.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Actions } from '../ability/ability.factory/ability.factory';
import type { UserContext } from '../ability/ability.factory/ability.factory';

@ApiTags('notes')
@ApiBearerAuth('JWT-auth')
@Controller('notes')
@UseGuards(JwtAuthGuard, AbilityGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @CheckAbility({ action: Actions.Create, subject: 'Note' })
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createNoteDto: CreateNoteDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.noteService.create(createNoteDto, user);
  }

  @Get()
  @CheckAbility({ action: Actions.Read, subject: 'Note' })
  @ApiOperation({
    summary: 'Get all notes (filtered by permissions)',
    description: 'Admin-only notes are only visible to CTO and TM roles',
  })
  @ApiResponse({ status: 200, description: 'List of accessible notes' })
  findAll(@CurrentUser() user: UserContext) {
    return this.noteService.findAll(user);
  }

  @Get(':id')
  @CheckAbility({ action: Actions.Read, subject: 'Note' })
  @ApiOperation({ summary: 'Get note by ID' })
  @ApiResponse({ status: 200, description: 'Note details' })
  @ApiResponse({ status: 404, description: 'Note not found or access denied' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserContext,
  ) {
    return this.noteService.findOne(id, user);
  }

  @Patch(':id')
  @CheckAbility({ action: Actions.Update, subject: 'Note' })
  @ApiOperation({ summary: 'Update note' })
  @ApiResponse({ status: 200, description: 'Note successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @CurrentUser() user: UserContext,
  ) {
    return this.noteService.update(id, updateNoteDto, user);
  }

  @Delete(':id')
  @CheckAbility({ action: Actions.Delete, subject: 'Note' })
  @ApiOperation({ summary: 'Delete note' })
  @ApiResponse({ status: 200, description: 'Note successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserContext,
  ) {
    return this.noteService.remove(id, user);
  }
}
