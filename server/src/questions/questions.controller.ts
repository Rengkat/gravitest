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

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/enums';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

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
  @ApiOperation({
    summary: 'Get question bank statistics',
    description:
      'Retrieve statistics about the question bank including total questions, distribution by subject, difficulty, and exam type. Can filter by school or platform questions.',
  })
  @ApiQuery({
    name: 'schoolId',
    required: false,
    description:
      'Filter by school UUID. Use "null" for platform-only questions.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'classId',
    required: false,
    description: 'Filter by class UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Question bank statistics retrieved successfully',
  })
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
  @ApiOperation({
    summary: 'Create a new question',
    description:
      'Create a new question with options, correct answer, explanations, and metadata. Supports both platform-wide and school-scoped questions.',
  })
  @ApiBody({ type: CreateQuestionDto })
  @ApiCreatedResponse({
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or validation failed',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'List or search questions',
    description:
      'Retrieve a list of questions with optional filtering and pagination. Can filter by school or platform questions.',
  })
  @ApiQuery({
    name: 'examType',
    required: false,
    description: 'Filter by exam type',
    example: 'waec',
  })
  @ApiQuery({
    name: 'subject',
    required: false,
    description: 'Filter by subject',
    example: 'mathematics',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Filter by year',
    example: 2020,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by question text',
    example: 'velocity',
  })
  @ApiQuery({
    name: 'difficulty',
    required: false,
    description: 'Filter by difficulty level',
    example: 'hard',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Questions retrieved successfully',
  })
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
  @ApiOperation({
    summary: 'Get session question pool',
    description:
      'Retrieve a random subset of active questions matching exam criteria. Used internally by ExamSessionsService when building CBT sessions.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        examType: {
          type: 'string',
          description: 'Type of exam',
          example: 'waec',
        },
        subjects: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of subject names',
          example: ['mathematics', 'english'],
        },
        year: {
          type: 'number',
          description: 'Exam year for filtering questions',
          example: 2024,
        },
        difficulty: {
          type: 'string',
          description: 'Difficulty level filter',
          example: 'medium',
        },
        type: {
          type: 'string',
          description: 'Question type filter',
          example: 'mcq',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of questions to return',
          example: 50,
        },
        shuffled: {
          type: 'boolean',
          description: 'Whether to shuffle the questions',
          example: true,
        },
        schoolId: {
          type: 'string',
          description: 'Optional school ID for school-specific questions',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
      required: ['subjects', 'limit'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Session question pool generated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid criteria or insufficient questions matching filters',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
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
  @ApiOperation({
    summary: 'Verify question answer',
    description:
      'Verify if a selected answer for a question is correct. Used for auto-scoring MCQ answers during exam sessions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question UUID',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        selectedLabel: {
          type: 'string',
          description: 'Selected answer label',
          example: 'B',
          enum: ['A', 'B', 'C', 'D'],
        },
      },
      required: ['selectedLabel'],
    },
  })
  @ApiOkResponse({
    description: 'Answer verified successfully',
    schema: {
      type: 'object',
      properties: {
        correct: {
          type: 'boolean',
          description: 'Whether the answer is correct',
          example: true,
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Question not found' })
  @ApiResponse({
    status: 400,
    description: 'Invalid answer label format',
  })
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
  @ApiOperation({
    summary: 'Get question by ID',
    description:
      'Retrieve a complete question with all options, correct answer, and explanations. Note: In exam context, correct answer is stripped by response interceptor.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Question retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Question not found' })
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
  @ApiOperation({
    summary: 'Update question information',
    description:
      "Update a question's details such as text, options, correct answer, and explanations.",
  })
  @ApiParam({
    name: 'id',
    description: 'Question UUID',
    type: String,
  })
  @ApiBody({ type: UpdateQuestionDto })
  @ApiResponse({
    status: 200,
    description: 'Question updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({ description: 'Question not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'Publish question',
    description:
      'Activate a question making it available for exams and practice sessions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Question published successfully',
  })
  @ApiNotFoundResponse({ description: 'Question not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.toggleActive(id, true);
  }

  @Patch(':id/unpublish')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({
    summary: 'Unpublish question',
    description:
      'Deactivate a question making it unavailable for exams and practice sessions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Question unpublished successfully',
  })
  @ApiNotFoundResponse({ description: 'Question not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'Duplicate question',
    description:
      'Create a copy of the question with all options, answer, and explanations in draft state. Useful for creating variants of existing questions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Source question UUID to duplicate',
    type: String,
  })
  @ApiCreatedResponse({
    description: 'Question duplicated successfully',
  })
  @ApiNotFoundResponse({ description: 'Source question not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  duplicate(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.duplicate(id);
  }

  // ─── BULK OPERATIONS ───────────────────────────────────────────────────────
  // PATCH /questions/bulk/active
  // Body: { ids: string[], isActive: boolean }
  //
  @Patch('bulk/active')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Bulk toggle question active status',
    description:
      'Activate or deactivate multiple questions at once. Only accessible by Super Admins.',
  })
  @ApiBody({ type: BulkToggleDto })
  @ApiResponse({
    status: 200,
    description: 'Questions status updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or question IDs',
  })
  @ApiNotFoundResponse({ description: 'One or more questions not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  bulkToggleActive(@Body() dto: BulkToggleDto) {
    return this.questionsService.bulkToggleActive(dto);
  }

  // DELETE /questions/bulk
  // Body: { ids: string[] }
  //
  @Delete('bulk')
  @Roles(UserRole.CLASS_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bulk delete questions',
    description:
      'Delete multiple questions at once. This is a hard delete operation.',
  })
  @ApiBody({ type: BulkDeleteDto })
  @ApiResponse({
    status: 200,
    description: 'Questions deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid question IDs',
  })
  @ApiNotFoundResponse({ description: 'One or more questions not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'Bulk import questions',
    description:
      'Import multiple questions from pre-validated JSON data. Supports partial success with detailed error reporting for failed imports.',
  })
  @ApiBody({ type: BulkImportDto })
  @ApiCreatedResponse({
    description:
      'Questions imported successfully. Returns count of imported, failed, and detailed errors.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid import data format or validation errors',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({
    summary: 'Delete question',
    description:
      'Permanently delete a question and all associated data (options, answer, explanations). Consider using unpublish for soft-deletion in production.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Question deleted successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete question that is part of active exam sessions',
  })
  @ApiNotFoundResponse({ description: 'Question not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.remove(id);
  }
}
