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
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  // ─── CREATE ──────────────────────────────────────────────────────────────
  // POST /schools
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({
    summary: 'Create a new school',
    description:
      'Create a new school with basic information including name, address, type, and subdomain.',
  })
  @ApiBody({ type: CreateSchoolDto })
  @ApiResponse({
    status: 201,
    description: 'School created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'School with same subdomain or name already exists',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  createSchool(@Body() dto: CreateSchoolDto) {
    return this.schoolsService.createSchool(dto);
  }

  // ─── LIST ────────────────────────────────────────────────────────────────
  // GET /schools
  // GET /schools?search=Lagos&state=Lagos&type=secondary&isActive=true
  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'List all schools',
    description:
      'Retrieve a filtered, paginated list of all schools in the system. Only accessible by Super Admins.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by school name or location',
    example: 'Lagos',
  })
  @ApiQuery({
    name: 'state',
    required: false,
    description: 'Filter by state',
    example: 'Lagos',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by school type (e.g., secondary, primary)',
    example: 'secondary',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    example: 'true',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Schools retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  findAll(@Query() filters: SchoolFiltersDto) {
    return this.schoolsService.findAll(filters);
  }

  // ─── FIND BY SUBDOMAIN ────────────────────────────────────────────────────
  // GET /schools/by-subdomain/:subdomain
  // Used for school portal login page to identify the school.
  @Get('by-subdomain/:subdomain')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({
    summary: 'Find school by subdomain',
    description:
      'Retrieve school information using its subdomain. Used for school portal login page identification.',
  })
  @ApiParam({
    name: 'subdomain',
    description: 'School subdomain identifier',
    type: String,
    example: 'greenfield-academy',
  })
  @ApiResponse({
    status: 200,
    description: 'School found successfully',
  })
  @ApiNotFoundResponse({ description: 'School not found with given subdomain' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  findBySubdomain(@Param('subdomain') subdomain: string) {
    return this.schoolsService.findBySubdomain(subdomain);
  }

  // ─── OVERVIEW / DASHBOARD ────────────────────────────────────────────────
  // GET /schools/:id/overview
  // Feeds the school admin dashboard (stats, top performers, weak subjects).
  @Get(':id/overview')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({
    summary: 'Get school overview',
    description:
      'Retrieve an overview of the school, including key metrics and information. Only accessible by Super Admins and School Admins.',
  })
  @ApiResponse({
    status: 200,
    description: 'School overview retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  getOverview(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.getOverview(id);
  }

  // ─── STATS ────────────────────────────────────────────────────────────────
  // GET /schools/:id/stats
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get(':id/stats')
  @ApiOperation({
    summary: 'Get school statistics',
    description:
      'Retrieve detailed statistics for a school including student counts, performance metrics, and engagement data.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'School statistics retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'School not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  getStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.getStats(id);
  }

  // ─── GET ONE ─────────────────────────────────────────────────────────────
  // GET /schools/:id
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({
    summary: 'Get school by ID',
    description:
      'Retrieve detailed information about a specific school. Only accessible by Super Admins and School Admins.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'School found successfully',
  })
  @ApiNotFoundResponse({ description: 'School not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.findOne(id);
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────
  // PATCH /schools/:id
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.CLASS_ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update school information',
    description:
      'Update school details such as name, address, contact information, and settings.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiBody({ type: UpdateSchoolDto })
  @ApiResponse({
    status: 200,
    description: 'School updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({ description: 'School not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSchoolDto) {
    return this.schoolsService.update(id, dto);
  }

  // ─── ACTIVATE / DEACTIVATE ───────────────────────────────────────────────
  // PATCH /schools/:id/activate
  // PATCH /schools/:id/deactivate
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activate school',
    description: 'Activate a school to enable full access and functionality.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'School activated successfully',
  })
  @ApiNotFoundResponse({ description: 'School not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.toggleActive(id, true);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Deactivate school',
    description: 'Deactivate a school to disable access and functionality.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'School deactivated successfully',
  })
  @ApiNotFoundResponse({ description: 'School not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.toggleActive(id, false);
  }

  // ─── DELETE ──────────────────────────────────────────────────────────────
  // DELETE /schools/:id
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete school',
    description:
      'Permanently remove a school from the system. This action cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'School deleted successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete school with active students or classes',
  })
  @ApiNotFoundResponse({ description: 'School not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'List school admins',
    description: 'Retrieve all administrators assigned to a specific school.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'School admins retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'School not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  getAdmins(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.getAdmins(id);
  }

  // ─── ASSIGN ADMIN ────────────────────────────────────────────────────────
  // POST /schools/:id/admins
  // Body: { userId: uuid }
  @Roles(UserRole.SUPER_ADMIN)
  @Post(':id/admins')
  @ApiOperation({
    summary: 'Assign admin to school',
    description:
      'Assign a new administrator to a school. Requires super admin privileges.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiBody({ type: AssignAdminDto })
  @ApiResponse({
    status: 201,
    description: 'Admin assigned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'User is already an admin for this school',
  })
  @ApiNotFoundResponse({ description: 'School or user not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'Remove admin from school',
    description:
      'Remove an administrator from a school. School admin can remove other admins, super admin can remove any admin.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiParam({
    name: 'adminId',
    description: 'Admin user UUID to remove',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Admin removed successfully',
  })
  @ApiNotFoundResponse({ description: 'School or admin not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'Get school students',
    description:
      'Retrieve students enrolled in a school with optional filtering by class and pagination.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiQuery({
    name: 'classId',
    required: false,
    description: 'Filter by class UUID',
    type: String,
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
  @ApiResponse({
    status: 200,
    description: 'School students retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'School not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'Bulk enroll students',
    description:
      'Enroll multiple students into a school at once, optionally assigning them to a specific class.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiBody({ type: BulkEnrollDto })
  @ApiResponse({
    status: 200,
    description: 'Students enrolled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or student IDs',
  })
  @ApiNotFoundResponse({ description: 'School or students not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  bulkEnroll(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: BulkEnrollDto,
  ) {
    return this.schoolsService.bulkEnroll(id, dto);
  }

  // Search students available to enroll
  // GET /schools/:id/students/search?q=emeka
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @Get(':id/students/search')
  @ApiOperation({
    summary: 'Search students available to enroll',
    description:
      'Search for students that can be enrolled in the school by name or email.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiQuery({
    name: 'q',
    description: 'Search query (student name or email)',
    type: String,
    example: 'emeka',
  })
  @ApiResponse({
    status: 200,
    description: 'Available students retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'School not found' })
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
  @ApiOperation({
    summary: 'Enroll student by identifier',
    description:
      'Enroll a single student using their email or admission number, with optional class assignment.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        identifier: {
          type: 'string',
          description: 'Student email or admission number',
          example: 'emeka@gmail.com',
        },
        schoolClassId: {
          type: 'string',
          description: 'Optional class UUID to assign student to',
          example: 'uuid-string',
        },
      },
      required: ['identifier'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Student enrolled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid identifier or student already enrolled',
  })
  @ApiNotFoundResponse({ description: 'School or student not found' })
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
  @ApiOperation({
    summary: 'Create class in school',
    description:
      'Create a new class within a school with name, section, and academic year.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiBody({ type: CreateClassDto })
  @ApiResponse({
    status: 201,
    description: 'Class created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Class with same name already exists in school',
  })
  @ApiNotFoundResponse({ description: 'School not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'List school classes',
    description:
      'Retrieve all classes in a school with optional filtering and sorting.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by class name',
    example: 'SS3',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    example: 'true',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort field',
    example: 'totalStudents',
  })
  @ApiResponse({
    status: 200,
    description: 'Classes retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'School not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  findClasses(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() filters: ClassFiltersDto,
  ) {
    return this.schoolsService.findClasses(id, filters);
  }

  // ─── GET ONE CLASS ───────────────────────────────────────────────────────
  // GET /schools/:id/classes/:classId
  @Get(':id/classes/:classId')
  @ApiOperation({
    summary: 'Get specific class details',
    description:
      'Retrieve detailed information for a specific class within a school.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiParam({
    name: 'classId',
    description: 'Class UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Class retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'School or class not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'Update class information',
    description:
      'Update class details such as name, section, academic year, and active status.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiParam({
    name: 'classId',
    description: 'Class UUID',
    type: String,
  })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({
    status: 200,
    description: 'Class updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({ description: 'School or class not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'Rotate class PIN',
    description:
      'Generate a new class access PIN. Returns the new class code and timestamp but never exposes the plain PIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiParam({
    name: 'classId',
    description: 'Class UUID',
    type: String,
  })
  @ApiBody({ type: RotatePinDto })
  @ApiResponse({
    status: 200,
    description:
      'PIN rotated successfully. Returns classCode and pinLastChangedAt',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid PIN format',
  })
  @ApiNotFoundResponse({ description: 'School or class not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'Delete class',
    description:
      'Remove a class from the school. Operation will fail if students are still enrolled in the class.',
  })
  @ApiParam({
    name: 'id',
    description: 'School UUID',
    type: String,
  })
  @ApiParam({
    name: 'classId',
    description: 'Class UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Class deleted successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete class with enrolled students',
  })
  @ApiNotFoundResponse({ description: 'School or class not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
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
  @ApiOperation({
    summary: 'Verify class PIN',
    description:
      'Verify a class access PIN. Used by teachers to authenticate before accessing class exam tools. Returns class details if valid.',
  })
  @ApiBody({ type: VerifyPinDto })
  @ApiResponse({
    status: 200,
    description:
      'PIN verified successfully. Returns class details or { valid: false }',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or invalid PIN',
  })
  verifyPin(@Body() dto: VerifyPinDto) {
    return this.schoolsService.verifyPin(dto);
  }
}
