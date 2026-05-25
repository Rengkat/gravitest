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
import { SchoolsService } from './schools.service';
import {
  AssignAdminDto,
  BulkEnrollDto,
  ClassFiltersDto,
  CreateClassDto,
  CreateSchoolDto,
  RotatePinDto,
  SchoolFiltersDto,
  UpdateClassDto,
  UpdateSchoolDto,
  VerifyPinDto,
} from './dto/school.dto';

// Uncomment when auth is wired:
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/enums';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  // ─── CREATE ──────────────────────────────────────────────────────────────
  // POST /schools
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Post()
  createSchool(@Body() dto: CreateSchoolDto) {
    return this.schoolsService.createSchool(dto);
  }

  // ─── LIST ────────────────────────────────────────────────────────────────
  // GET /schools
  // GET /schools?search=Lagos&state=Lagos&type=secondary&isActive=true
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  findAll(@Query() filters: SchoolFiltersDto) {
    return this.schoolsService.findAll(filters);
  }

  // ─── FIND BY SUBDOMAIN ────────────────────────────────────────────────────
  // GET /schools/by-subdomain/:subdomain
  // Used for school portal login page to identify the school.
  @Get('by-subdomain/:subdomain')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  findBySubdomain(@Param('subdomain') subdomain: string) {
    return this.schoolsService.findBySubdomain(subdomain);
  }

  // ─── OVERVIEW / DASHBOARD ────────────────────────────────────────────────
  // GET /schools/:id/overview
  // Feeds the school admin dashboard (stats, top performers, weak subjects).
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get(':id/overview')
  getOverview(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.getOverview(id);
  }

  // ─── STATS ────────────────────────────────────────────────────────────────
  // GET /schools/:id/stats
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get(':id/stats')
  getStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.getStats(id);
  }

  // ─── GET ONE ─────────────────────────────────────────────────────────────
  // GET /schools/:id
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.findOne(id);
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────
  // PATCH /schools/:id
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.CLASS_ADMIN)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSchoolDto) {
    return this.schoolsService.update(id, dto);
  }

  // ─── ACTIVATE / DEACTIVATE ───────────────────────────────────────────────
  // PATCH /schools/:id/activate
  // PATCH /schools/:id/deactivate
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/activate')
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.toggleActive(id, true);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.toggleActive(id, false);
  }

  // ─── DELETE ──────────────────────────────────────────────────────────────
  // DELETE /schools/:id
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.remove(id);
  }

  // ═══════════════════════════════════════════════════════════════
  // SCHOOL ADMINS
  // ═══════════════════════════════════════════════════════════════

  // ─── LIST ADMINS ─────────────────────────────────────────────────────────
  // GET /schools/:id/admins
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get(':id/admins')
  getAdmins(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.getAdmins(id);
  }

  // ─── ASSIGN ADMIN ────────────────────────────────────────────────────────
  // POST /schools/:id/admins
  // Body: { userId: uuid }
  @Roles(UserRole.SUPER_ADMIN)
  @Post(':id/admins')
  assignAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignAdminDto,
  ) {
    return this.schoolsService.assignAdmin(id, dto);
  }

  // ─── REMOVE ADMIN ────────────────────────────────────────────────────────
  // DELETE /schools/:id/admins/:adminId
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Delete(':id/admins/:adminId')
  @HttpCode(HttpStatus.OK)
  removeAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('adminId', ParseUUIDPipe) adminId: string,
  ) {
    return this.schoolsService.removeAdmin(id, adminId);
  }

  // ═══════════════════════════════════════════════════════════════
  // STUDENTS
  // ═══════════════════════════════════════════════════════════════

  // ─── GET SCHOOL STUDENTS ─────────────────────────────────────────────────
  // GET /schools/:id/students
  // GET /schools/:id/students?classId=<uuid>&page=1&limit=20
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.CLASS_ADMIN)
  @Get(':id/students')
  getStudents(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('classId') classId?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 50,
  ) {
    return this.schoolsService.getSchoolStudents(id, classId, page, limit);
  }

  // ─── BULK ENROLL STUDENTS ─────────────────────────────────────────────────
  // POST /schools/:id/students/bulk-enroll
  // Body: { studentProfileIds: string[], schoolClassId?: string }
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.CLASS_ADMIN)
  @Post(':id/students/bulk-enroll')
  @HttpCode(HttpStatus.OK)
  bulkEnroll(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: BulkEnrollDto,
  ) {
    return this.schoolsService.bulkEnroll(id, dto);
  }

  // Search students available to enroll
  // GET /schools/:id/students/search?q=emeka
  @Get(':id/students/search')
  searchStudentsToEnroll(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('q') query: string,
  ) {
    return this.schoolsService.findStudentsToEnroll(query, id);
  }

  // Enroll single student by email or admissionNo
  // POST /schools/:id/students/enroll
  // Body: { identifier: 'emeka@gmail.com', schoolClassId?: uuid }
  @Post(':id/students/enroll')
  @HttpCode(HttpStatus.OK)
  enrollByIdentifier(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { identifier: string; schoolClassId?: string },
  ) {
    return this.schoolsService.enrollByIdentifier(id, dto);
  }

  // ═══════════════════════════════════════════════════════════════
  // CLASSES
  // ═══════════════════════════════════════════════════════════════

  // ─── CREATE CLASS ────────────────────────────────────────────────────────
  // POST /schools/:id/classes
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Post(':id/classes')
  createClass(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateClassDto,
  ) {
    return this.schoolsService.createClass(id, dto);
  }

  // ─── LIST CLASSES ────────────────────────────────────────────────────────
  // GET /schools/:id/classes
  // GET /schools/:id/classes?search=SS3&isActive=true&sortBy=totalStudents
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get(':id/classes')
  findClasses(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() filters: ClassFiltersDto,
  ) {
    return this.schoolsService.findClasses(id, filters);
  }

  // ─── GET ONE CLASS ───────────────────────────────────────────────────────
  // GET /schools/:id/classes/:classId
  @Get(':id/classes/:classId')
  findClass(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('classId', ParseUUIDPipe) classId: string,
  ) {
    return this.schoolsService.findClass(id, classId);
  }

  // ─── UPDATE CLASS ────────────────────────────────────────────────────────
  // PATCH /schools/:id/classes/:classId
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.CLASS_ADMIN)
  @Patch(':id/classes/:classId')
  updateClass(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('classId', ParseUUIDPipe) classId: string,
    @Body() dto: UpdateClassDto,
  ) {
    return this.schoolsService.updateClass(id, classId, dto);
  }

  // ─── ROTATE CLASS PIN ────────────────────────────────────────────────────
  // PATCH /schools/:id/classes/:classId/rotate-pin
  // Body: { newPin: "1234" }
  // Returns new classCode + pinLastChangedAt (never returns the plain PIN)
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Patch(':id/classes/:classId/rotate-pin')
  rotatePin(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('classId', ParseUUIDPipe) classId: string,
    @Body() dto: RotatePinDto,
  ) {
    return this.schoolsService.rotatePin(id, classId, dto);
  }

  // ─── DELETE CLASS ────────────────────────────────────────────────────────
  // DELETE /schools/:id/classes/:classId
  // Will fail if students are still enrolled.
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Delete(':id/classes/:classId')
  @HttpCode(HttpStatus.OK)
  removeClass(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('classId', ParseUUIDPipe) classId: string,
  ) {
    return this.schoolsService.removeClass(id, classId);
  }

  // ─── VERIFY CLASS PIN (teacher access) ───────────────────────────────────
  // POST /schools/classes/verify-pin
  // Body: { classCode: "ABC-SS2A-2025", pin: "1234" }
  // Teacher uses this to authenticate before accessing class exam tools.
  // Returns class details if valid, { valid: false } if not.
  @Post('classes/verify-pin')
  @HttpCode(HttpStatus.OK)
  verifyPin(@Body() dto: VerifyPinDto) {
    return this.schoolsService.verifyPin(dto);
  }
}
