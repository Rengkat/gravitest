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

// Uncomment when auth is wired:
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
@UseGuards(JwtAuthGuard)
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
  findAll(@Query() filters: StudentFiltersDto) {
    return this.studentsService.findAll(filters);
  }

  // ─── GET PROFILE BY ID ────────────────────────────────────────────────────

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.findByProfileId(id);
  }

  // ─── GET PROFILE BY USER ID ───────────────────────────────────────────────

  @Get('me/profile')
  @Roles(UserRole.STUDENT, UserRole.PROFESSIONAL_STUDENT)
  findByUser(@UserId() userId: string) {
    return this.studentsService.findByUserId(userId);
  }

  // ─── DASHBOARD OVERVIEW ───────────────────────────────────────────────────
  // GET /students/:id/overview
  @Get(':id/overview')
  getOverview(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.getOverview(id);
  }

  // ─── PERFORMANCE ANALYTICS ────────────────────────────────────────────────
  // GET /students/:id/performance
  @Get(':id/performance')
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
  getStreak(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.getStreakInfo(id);
  }

  // ─── TOPIC MASTERY HISTORY ────────────────────────────────────────────────
  // GET /students/:id/topic-mastery
  // GET /students/:id/topic-mastery?subject=physics
  //
  @Get(':id/topic-mastery')
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
  enroll(@Body() dto: EnrollStudentDto) {
    return this.studentsService.enrollInSchool(dto);
  }

  // ─── REMOVE FROM SCHOOL ───────────────────────────────────────────────────
  // DELETE /students/:id/school
  //
  @Delete(':id/school')
  @HttpCode(HttpStatus.OK)
  // @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
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
  recordActivity(@Body() dto: RecordActivityDto) {
    return this.studentsService.recordActivity(dto);
  }
}
