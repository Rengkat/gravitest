import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import {
  ActivityQueryDto,
  AdminUpdateStudentDto,
  AwardXpDto,
  EnrollStudentDto,
  RecordActivityDto,
  SessionHistoryFiltersDto,
  StudentFiltersDto,
  UpdateStudentProfileDto,
  WeakTopicFiltersDto,
} from './dto/update-student.dto';
import { UserRole } from 'src/common/enums/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserId } from 'src/auth/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // ─── ADMIN: LIST ALL STUDENTS ─────────────────────────────────────────────
  // GET /students
  // GET /students?schoolId=<uuid>&search=Emeka&sortBy=totalXp&page=1&limit=20
  // GET /students?hasSchool=false   → self-registered only
  //
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({
    summary: 'List all students',
    description:
      'Retrieve a paginated list of students with optional filters. Supports filtering by school, search term, and sorting.',
  })
  @ApiQuery({
    name: 'schoolId',
    required: false,
    description: 'Filter by school UUID',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by student name or email',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort field (e.g., totalXp, createdAt)',
    example: 'totalXp',
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
  @ApiQuery({
    name: 'hasSchool',
    required: false,
    description: 'Filter self-registered students (hasSchool=false)',
  })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  findAll(@Query() filters: StudentFiltersDto) {
    return this.studentsService.findAll(filters);
  }

  // ─── GET PROFILE BY ID ────────────────────────────────────────────────────

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({
    summary: 'Get student profile by ID',
    description: 'Retrieve a student profile by its UUID.',
  })
  @ApiParam({ name: 'id', description: 'Student profile UUID', type: String })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Student profile not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.findByProfileId(id);
  }

  // ─── GET PROFILE BY USER ID ───────────────────────────────────────────────

  @Get('me/profile')
  @Roles(UserRole.STUDENT, UserRole.PROFESSIONAL_STUDENT)
  @ApiOperation({
    summary: 'Get current student profile',
    description:
      'Retrieve the profile of the currently authenticated student by their user ID.',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  findByUser(@UserId() userId: string) {
    return this.studentsService.findByUserId(userId);
  }

  // ─── DASHBOARD OVERVIEW ───────────────────────────────────────────────────
  // GET /students/:id/overview
  @Get(':id/overview')
  @ApiOperation({
    summary: 'Get student dashboard overview',
    description:
      'Retrieve a comprehensive overview of student performance and statistics.',
  })
  @ApiParam({ name: 'id', description: 'Student profile UUID', type: String })
  @ApiResponse({ status: 200, description: 'Overview retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Student profile not found' })
  getOverview(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.getOverview(id);
  }

  // ─── PERFORMANCE ANALYTICS ────────────────────────────────────────────────
  // GET /students/:id/performance
  @Get(':id/performance')
  @ApiOperation({
    summary: 'Get student performance analytics',
    description:
      'Retrieve performance analytics for a student over a specified number of days (default: 90).',
  })
  @ApiParam({ name: 'id', description: 'Student profile UUID', type: String })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to analyze',
    example: 90,
  })
  @ApiResponse({
    status: 200,
    description: 'Performance data retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Student profile not found' })
  getPerformance(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ) {
    return this.studentsService.getPerformance(id, days ?? 90);
  }

  // ─── SESSION HISTORY ──────────────────────────────────────────────────────
  // GET /students/:id/sessions
  // GET /students/:id/sessions?examType=waec&sortBy=percentage&sortOrder=DESC

  @Get(':id/sessions')
  @ApiOperation({
    summary: 'Get student session history',
    description:
      'Retrieve exam session history for a student with optional filters.',
  })
  @ApiParam({ name: 'id', description: 'Student profile UUID', type: String })
  @ApiQuery({
    name: 'examType',
    required: false,
    description: 'Filter by exam type (e.g., waec, neco)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort field',
    example: 'percentage',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort direction (ASC or DESC)',
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'Session history retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Student profile not found' })
  getSessionHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() filters: SessionHistoryFiltersDto,
  ) {
    return this.studentsService.getSessionHistory(id, filters);
  }

  // ─── WEAK TOPICS ──────────────────────────────────────────────────────────
  // GET /students/:id/weak-topics
  // GET /students/:id/weak-topics?subject=mathematics&status=active
  //
  @Get(':id/weak-topics')
  @ApiOperation({
    summary: 'Get student weak topics',
    description:
      'Retrieve weak topics for a student with optional filters for subject and status.',
  })
  @ApiParam({ name: 'id', description: 'Student profile UUID', type: String })
  @ApiQuery({
    name: 'subject',
    required: false,
    description: 'Filter by subject',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status (active, resolved)',
  })
  @ApiResponse({
    status: 200,
    description: 'Weak topics retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Student profile not found' })
  getWeakTopics(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() filters: WeakTopicFiltersDto,
  ) {
    return this.studentsService.getWeakTopics(id, filters);
  }

  // ─── STUDY ACTIVITY / HEATMAP ─────────────────────────────────────────────
  // GET /students/:id/activity
  // GET /students/:id/activity?days=90
  // GET /students/:id/activity?from=2025-01-01&to=2025-03-31
  //
  @Get(':id/activity')
  @ApiOperation({
    summary: 'Get student study activity',
    description: 'Retrieve study activity and heatmap data for a student.',
  })
  @ApiParam({ name: 'id', description: 'Student profile UUID', type: String })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to include',
    example: 90,
  })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'Start date (YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'End date (YYYY-MM-DD)',
    example: '2025-03-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Study activity retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Student profile not found' })
  getStudyActivity(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ActivityQueryDto,
  ) {
    return this.studentsService.getStudyActivity(id, query);
  }

  // ─── STREAK INFO ──────────────────────────────────────────────────────────
  // GET /students/:id/streak
  //
  @Get(':id/streak')
  @ApiOperation({
    summary: 'Get student streak information',
    description: 'Retrieve current streak and streak history for a student.',
  })
  @ApiParam({ name: 'id', description: 'Student profile UUID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Streak info retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Student profile not found' })
  getStreak(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.getStreakInfo(id);
  }

  // ─── TOPIC MASTERY HISTORY ────────────────────────────────────────────────
  // GET /students/:id/topic-mastery
  // GET /students/:id/topic-mastery?subject=physics
  //
  @Get(':id/topic-mastery')
  @ApiOperation({
    summary: 'Get student topic mastery history',
    description:
      'Retrieve topic mastery progression for a student with optional subject filter.',
  })
  @ApiParam({ name: 'id', description: 'Student profile UUID', type: String })
  @ApiQuery({
    name: 'subject',
    required: false,
    description: 'Filter by subject',
    example: 'physics',
  })
  @ApiResponse({
    status: 200,
    description: 'Topic mastery retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Student profile not found' })
  getTopicMastery(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('subject') subject?: string,
  ) {
    return this.studentsService.getTopicMasteryHistory(id, subject);
  }

  // ─── LEADERBOARD ──────────────────────────────────────────────────────────
  // GET /students/leaderboard?page=1&limit=50
  // GET /students/leaderboard?schoolId=<uuid>   → school leaderboard
  // GET /students/leaderboard?currentProfileId=<uuid>  → highlights current user
  //
  @Get('leaderboard')
  @ApiOperation({
    summary: 'Get student leaderboard',
    description:
      'Retrieve the student leaderboard with optional filters for school and highlighting current user.',
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
    example: 50,
  })
  @ApiQuery({
    name: 'schoolId',
    required: false,
    description: 'Filter by school UUID',
  })
  @ApiQuery({
    name: 'currentProfileId',
    required: false,
    description: 'Profile UUID to highlight in results',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully',
  })
  getLeaderboard(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 50,
    @Query('schoolId') schoolId?: string,
    @Query('currentProfileId') currentProfileId?: string,
  ) {
    return this.studentsService.getLeaderboard({
      page,
      limit,
      schoolId,
      currentProfileId,
    });
  }

  // ─── UPDATE OWN PROFILE ───────────────────────────────────────────────────
  // PATCH /students/:id/profile
  // Student edits their own exam targets, subjects, parent contact, etc.
  //
  @Patch(':id/profile')
  @ApiOperation({
    summary: 'Update student profile',
    description:
      'Allow students to update their own profile including exam targets, subjects, and parent contact information.',
  })
  @ApiParam({ name: 'id', description: 'Student profile UUID', type: String })
  @ApiBody({ type: UpdateStudentProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Student profile not found' })
  updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.studentsService.updateProfile(id, dto);
  }

  // ─── ADMIN UPDATE ─────────────────────────────────────────────────────────
  // PATCH /students/:id/admin
  // Admin can change school assignment, class, active status.
  //
  @Patch(':id/admin')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({
    summary: 'Admin update student',
    description:
      'Admin can modify school assignment, class, and active status of a student.',
  })
  @ApiParam({ name: 'id', description: 'Student profile UUID', type: String })
  @ApiBody({ type: AdminUpdateStudentDto })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Student profile not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  adminUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateStudentDto,
  ) {
    return this.studentsService.adminUpdate(id, dto);
  }

  // ─── ENROLL IN SCHOOL ─────────────────────────────────────────────────────
  // POST /students/enroll
  // School admin assigns a self-registered student to their school.
  //
  @Post('enroll')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({
    summary: 'Enroll student in school',
    description: 'Assign a self-registered student to a school.',
  })
  @ApiBody({ type: EnrollStudentDto })
  @ApiResponse({ status: 201, description: 'Student enrolled successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or student already enrolled',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  enroll(@Body() dto: EnrollStudentDto) {
    return this.studentsService.enrollInSchool(dto);
  }

  // ─── REMOVE FROM SCHOOL ───────────────────────────────────────────────────
  // DELETE /students/:id/school
  //
  @Delete(':id/school')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({
    summary: 'Remove student from school',
    description: 'Remove a student from their assigned school.',
  })
  @ApiParam({ name: 'id', description: 'Student profile UUID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Student removed from school successfully',
  })
  @ApiNotFoundResponse({ description: 'Student profile not found' })
  removeFromSchool(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.removeFromSchool(id);
  }

  // ─── AWARD XP (internal / admin) ──────────────────────────────────────────
  // POST /students/award-xp
  // Called internally by ExamSessions after scoring.
  // Can also be called by admin for manual XP adjustments.
  //
  @Post('award-xp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Award XP to student',
    description:
      'Award experience points to a student. Used internally by exam sessions or manually by admins.',
  })
  @ApiBody({ type: AwardXpDto })
  @ApiResponse({ status: 200, description: 'XP awarded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  awardXp(@Body() dto: AwardXpDto) {
    return this.studentsService.awardXp(dto);
  }

  // ─── RECORD ACTIVITY (internal) ───────────────────────────────────────────
  // POST /students/record-activity
  // Called by ExamSessions after session completes to update
  // StudyActivity, streak, and profile caches.
  //
  @Post('record-activity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Record student activity',
    description:
      'Record study activity after a session completes. Updates StudyActivity, streak, and profile caches.',
  })
  @ApiBody({ type: RecordActivityDto })
  @ApiResponse({ status: 200, description: 'Activity recorded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  recordActivity(@Body() dto: RecordActivityDto) {
    return this.studentsService.recordActivity(dto);
  }
}
