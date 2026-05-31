import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import {
  UpdateQuestionDto,
  QuestionFiltersDto,
  BulkToggleDto,
  BulkDeleteDto,
} from './dto/update-question.dto';
import { BulkImportDto } from './dto/BulkQuestionsImport.dto';

// Uncomment when auth guard is wired up:
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // ─── STATS ─────────────────────────────────────────────────────────────────
  // GET /questions/stats
  // GET /questions/stats?schoolId=<uuid>   → school-specific bank
  // GET /questions/stats?schoolId=null     → platform bank only
  //
  @Get('stats')
  getBankStats(
    @Query('schoolId') schoolId?: string,
    @Query('classId') classId?: string,
  ) {
    return this.questionsService.getBankStats(schoolId, classId);
  }

  // ─── CREATE ────────────────────────────────────────────────────────────────
  // POST /questions
  // Body: CreateQuestionDto
  // Roles: Admin, SchoolAdmin (for school-scoped questions)
  //
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  create(@Body() dto: CreateQuestionDto) {
    return this.questionsService.create(dto);
  }

  // ─── LIST / SEARCH ─────────────────────────────────────────────────────────
  // GET /questions
  // GET /questions?examType=waec&subject=mathematics&year=2020
  // GET /questions?search=velocity&difficulty=hard&page=1&limit=20
  // GET /questions?schoolId=<uuid>   → school questions
  // GET /questions?schoolId=null     → platform questions only
  //
  @Get()
  findAll(@Query() filters: QuestionFiltersDto) {
    return this.questionsService.findAll(filters);
  }

  // ─── SESSION POOL ──────────────────────────────────────────────────────────
  // POST /questions/session-pool
  // Called internally by ExamSessionsService when building a new CBT session.
  // Returns a random subset of active questions matching the exam criteria.
  //
  @Post('session-pool')
  @Roles(UserRole.SUPER_ADMIN, UserRole.STUDENT, UserRole.PROFESSIONAL_STUDENT)
  getSessionPool(
    @Body()
    body: {
      examType?: string;
      subjects: string[];
      year?: number;
      difficulty?: string;
      type?: string;
      limit: number;
      shuffled?: boolean;
      schoolId?: string;
    },
  ) {
    return this.questionsService.getSessionPool(body);
  }

  // ─── VERIFY ANSWER ─────────────────────────────────────────────────────────
  // POST /questions/:id/verify-answer
  // Body: { selectedLabel: 'A' | 'B' | 'C' | 'D' }
  // Returns { correct: boolean }
  // Used by session submission to auto-score MCQ answers.
  //
  @Post(':id/verify-answer')
  @HttpCode(HttpStatus.OK)
  async verifyAnswer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('selectedLabel') selectedLabel: string,
  ) {
    const correct = await this.questionsService.verifyAnswer(id, selectedLabel);
    return { correct };
  }

  // ─── GET ONE ───────────────────────────────────────────────────────────────
  // GET /questions/:id
  // Returns full question with options, answer, explanations.
  // Students get this during exam; answer.correctLabel is stripped by a
  // response interceptor in exam/session context (not yet wired here).
  //
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.findOne(id);
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────
  // PATCH /questions/:id
  // Body: UpdateQuestionDto (any subset of CreateQuestionDto)
  // Supplying `options` replaces the full option + answer set atomically.
  // Supplying `explanations` replaces all explanations atomically.
  //
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, dto);
  }

  // ─── PUBLISH (toggle active) ───────────────────────────────────────────────
  // PATCH /questions/:id/publish    → isActive = true
  // PATCH /questions/:id/unpublish  → isActive = false
  //
  @Patch(':id/publish')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.toggleActive(id, true);
  }

  @Patch(':id/unpublish')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  unpublish(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.toggleActive(id, false);
  }

  // ─── DUPLICATE ─────────────────────────────────────────────────────────────
  // POST /questions/:id/duplicate
  // Creates a copy of the question (with all options/answer/explanations)
  // in draft state. Useful for tweaking a past question variant.
  //
  @Post(':id/duplicate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  duplicate(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.duplicate(id);
  }

  // ─── BULK OPERATIONS ───────────────────────────────────────────────────────
  // PATCH /questions/bulk/active
  // Body: { ids: string[], isActive: boolean }
  //
  @Patch('bulk/active')
  @Roles(UserRole.SUPER_ADMIN)
  bulkToggleActive(@Body() dto: BulkToggleDto) {
    return this.questionsService.bulkToggleActive(dto);
  }

  // DELETE /questions/bulk
  // Body: { ids: string[] }
  //
  @Delete('bulk')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.CLASS_ADMIN)
  bulkDelete(@Body() dto: BulkDeleteDto) {
    return this.questionsService.bulkDelete(dto);
  }

  // ─── BULK IMPORT ───────────────────────────────────────────────────────────
  // POST /questions/bulk/import
  // Body: BulkImportDto { schoolId?, questions: BulkQuestionRowDto[] }
  // Accepts pre-validated JSON. For CSV/XLSX, parse to this shape on the
  // frontend (the admin UI already has a Bulk Import button on the create page).
  // Returns { imported, failed, errors[] } — partial success is allowed.
  //
  @Post('bulk/import')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  bulkImport(@Body() dto: BulkImportDto) {
    return this.questionsService.bulkImport(dto);
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────
  // DELETE /questions/:id
  // Hard-deletes. Cascade will remove options, answer, explanations.
  // Consider soft-delete (toggle isActive) for production safety.
  //
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.remove(id);
  }
}
