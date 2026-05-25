import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { School } from './entities/school.entity';
import { SchoolClass } from './entities/school-class.entity';
import { SchoolAdmin } from './entities/school-admin.entity';

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

import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginatedResult } from 'src/common/pagination/pagination.interface';
import { SchoolOverview, PinVerifyResult } from './types/school.types';
import { HashProvider } from 'src/common/hash/providers/Hash.provider';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepo: Repository<School>,

    @InjectRepository(SchoolClass)
    private readonly classRepo: Repository<SchoolClass>,

    @InjectRepository(SchoolAdmin)
    private readonly adminRepo: Repository<SchoolAdmin>,

    private readonly dataSource: DataSource,
    private readonly paginationProvider: PaginationProvider,

    private readonly hashProvider: HashProvider,
  ) {}

  // ─── CREATE SCHOOL ────────────────────────────────────────────────────────

  async createSchool(dto: CreateSchoolDto): Promise<School> {
    const existing = await this.schoolRepo.findOne({
      where: { subdomain: dto.subdomain },
    });
    if (existing) {
      throw new ConflictException(
        `Subdomain "${dto.subdomain}" is already taken.`,
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const school = manager.create(School, {
        name: dto.name,
        subdomain: dto.subdomain,
        type: dto.type,
        logoUrl: dto.logoUrl ?? null,
        brandColor: dto.brandColor ?? null,
        address: dto.address ?? null,
        lga: dto.lga ?? null,
        state: dto.state ?? null,
        phone: dto.phone ?? null,
        email: dto.email ?? null,
        website: dto.website ?? null,
        maxStudents: dto.maxStudents ?? 500,
        isActive: true,
        totalStudents: 0,
      });
      const saved = await manager.save(school);

      // Assign first admin if userId provided
      if (dto.adminUserId) {
        const schoolAdmin = manager.create(SchoolAdmin, {
          user: { id: dto.adminUserId } as any,
          school: saved,
          isActive: true,
        });
        await manager.save(schoolAdmin);
      }

      return saved;
    });
  }

  // ─── LIST SCHOOLS ─────────────────────────────────────────────────────────

  async findAll(filters: SchoolFiltersDto): Promise<PaginatedResult<School>> {
    const {
      page,
      limit,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      ...fieldFilters
    } = filters;

    const qb = this.schoolRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.admins', 'admins')
      .leftJoin('admins.user', 'u')
      .addSelect(['u.id', 'u.firstName', 'u.lastName', 'u.email']);

    if (search) {
      qb.andWhere(
        '(s.name ILIKE :search OR s.subdomain ILIKE :search OR s.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (fieldFilters.type)
      qb.andWhere('s.type = :type', { type: fieldFilters.type });

    if (fieldFilters.state)
      qb.andWhere('s.state = :state', { state: fieldFilters.state });

    if (fieldFilters.isActive !== undefined) {
      const isActive =
        fieldFilters.isActive === true ||
        (fieldFilters.isActive as any) === 'true';
      qb.andWhere('s.isActive = :isActive', { isActive });
    }

    const sortMap: Record<string, string> = {
      createdAt: 's.createdAt',
      name: 's.name',
      totalStudents: 's.totalStudents',
      state: 's.state',
    };
    qb.orderBy(sortMap[sortBy] ?? 's.createdAt', sortOrder);

    return this.paginationProvider.paginateQueryBuilder(qb, { page, limit });
  }

  // ─── FIND ONE ─────────────────────────────────────────────────────────────

  async findOne(id: string): Promise<School> {
    return this.findOneOrThrow(id);
  }

  async findBySubdomain(subdomain: string): Promise<School> {
    const school = await this.schoolRepo.findOne({
      where: { subdomain },
      relations: ['admins', 'classes'],
    });
    if (!school)
      throw new NotFoundException(
        `School with subdomain "${subdomain}" not found.`,
      );
    return school;
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateSchoolDto): Promise<School> {
    await this.findOneOrThrow(id);

    if (dto.subdomain) {
      const conflict = await this.schoolRepo.findOne({
        where: { subdomain: dto.subdomain },
      });
      if (conflict && conflict.id !== id) {
        throw new ConflictException(
          `Subdomain "${dto.subdomain}" is already taken.`,
        );
      }
    }

    await this.schoolRepo.update(id, dto as any);
    return this.findOneOrThrow(id);
  }

  // ─── TOGGLE ACTIVE ────────────────────────────────────────────────────────

  async toggleActive(id: string, isActive: boolean): Promise<School> {
    await this.findOneOrThrow(id);
    await this.schoolRepo.update(id, { isActive });
    return this.findOneOrThrow(id);
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────

  async remove(id: string): Promise<{ id: string }> {
    await this.findOneOrThrow(id);
    await this.schoolRepo.delete(id);
    return { id };
  }

  // ─── OVERVIEW / DASHBOARD ─────────────────────────────────────────────────

  async getOverview(schoolId: string): Promise<SchoolOverview> {
    const school = await this.findOneOrThrow(schoolId);

    const [totalClasses, activeClasses] = await Promise.all([
      this.classRepo.count({ where: { schoolId } }),
      this.classRepo.count({ where: { schoolId, isActive: true } }),
    ]);

    // Pull performance data from student_profiles cache
    const perfRaw = await this.dataSource.query(
      `SELECT 
        COUNT(*)::int AS "totalStudents",
        ROUND(AVG(sp."averageScore")::numeric, 1) AS "averageScore",
        ROUND((COUNT(*) FILTER (WHERE sp."averageScore" >= 50)::float / NULLIF(COUNT(*), 0) * 100)::numeric, 1) AS "passRate",
        MAX(sp."averageScore") AS "topPerformerScore"
       FROM student_profiles sp
       WHERE sp.school_id = $1`,
      [schoolId],
    );

    const perf = perfRaw[0] ?? {};

    // Top 5 performers
    const topPerformersRaw = await this.dataSource.query(
      `SELECT sp.id AS "studentProfileId",
              u."firstName" || ' ' || u."lastName" AS name,
              u."avatarUrl",
              sp."averageScore" AS score,
              sc.name AS "className"
       FROM student_profiles sp
       LEFT JOIN users u ON u.id = sp.user_id
       LEFT JOIN school_classes sc ON sc.id = sp.school_class_id
       WHERE sp.school_id = $1
       ORDER BY sp."averageScore" DESC
       LIMIT 5`,
      [schoolId],
    );

    // Weak subjects from subject performance jsonb
    const weakSubjectsRaw = await this.dataSource.query(
      `SELECT key AS subject,
              ROUND(AVG((value->>'averageScore')::float)::numeric, 1) AS "averageScore",
              COUNT(*) AS "studentCount"
       FROM student_profiles sp,
            jsonb_each(sp."subjectPerformance") 
       WHERE sp.school_id = $1
         AND sp."subjectPerformance" IS NOT NULL
       GROUP BY key
       ORDER BY AVG((value->>'averageScore')::float) ASC
       LIMIT 3`,
      [schoolId],
    );

    // New students this month
    const newThisMonth = await this.dataSource.query(
      `SELECT COUNT(*)::int AS count FROM student_profiles
       WHERE school_id = $1 AND "createdAt" >= date_trunc('month', NOW())`,
      [schoolId],
    );

    return {
      school,
      stats: {
        totalStudents: perf.totalStudents ?? 0,
        totalClasses,
        activeClasses,
        averageScore: perf.averageScore ?? 0,
        passRate: perf.passRate ?? 0,
        completionRate: 0, // calculated from exam sessions when ExamSessionsModule is built
        topPerformerScore: perf.topPerformerScore ?? 0,
        activeSessions: 0, // from ExamSessionsModule
        newStudentsThisMonth: newThisMonth[0]?.count ?? 0,
      },
      topPerformers: topPerformersRaw.map((r: any) => ({
        ...r,
        improvement: 0, // enriched by ExamSessionsModule later
      })),
      weakSubjects: weakSubjectsRaw.map((r: any) => ({
        subject: r.subject,
        averageScore: Number(r.averageScore),
        studentCount: Number(r.studentCount),
        trend: 'stable' as const,
      })),
      recentActivity: [], // enriched by ExamSessionsModule later
    };
  }

  // ─── STATS (simpler version for admin list view) ──────────────────────────

  async getStats(schoolId: string) {
    await this.findOneOrThrow(schoolId);

    const [totalStudents, totalClasses, activeClasses] = await Promise.all([
      this.dataSource.query(
        `SELECT COUNT(*)::int AS count FROM student_profiles WHERE school_id = $1`,
        [schoolId],
      ),
      this.classRepo.count({ where: { schoolId } }),
      this.classRepo.count({ where: { schoolId, isActive: true } }),
    ]);

    return {
      totalStudents: totalStudents[0]?.count ?? 0,
      totalClasses,
      activeClasses,
    };
  }

  // ─── ASSIGN ADMIN ─────────────────────────────────────────────────────────

  async assignAdmin(
    schoolId: string,
    dto: AssignAdminDto,
  ): Promise<SchoolAdmin> {
    await this.findOneOrThrow(schoolId);

    const existing = await this.adminRepo.findOne({
      where: { user: { id: dto.userId }, school: { id: schoolId } },
    });
    if (existing) {
      throw new ConflictException('User is already an admin of this school.');
    }

    const admin = this.adminRepo.create({
      user: { id: dto.userId } as any,
      school: { id: schoolId } as any,
      isActive: true,
    });

    return this.adminRepo.save(admin);
  }

  // ─── REMOVE ADMIN ─────────────────────────────────────────────────────────

  async removeAdmin(
    schoolId: string,
    adminId: string,
  ): Promise<{ id: string }> {
    await this.findOneOrThrow(schoolId);
    const admin = await this.adminRepo.findOne({
      where: { id: adminId, school: { id: schoolId } },
    });
    if (!admin) throw new NotFoundException('School admin not found.');
    await this.adminRepo.delete(adminId);
    return { id: adminId };
  }

  // ─── LIST ADMINS ──────────────────────────────────────────────────────────

  async getAdmins(schoolId: string): Promise<SchoolAdmin[]> {
    await this.findOneOrThrow(schoolId);
    return this.adminRepo.find({
      where: { school: { id: schoolId } },
      relations: ['user'],
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CLASSES
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── CREATE CLASS ─────────────────────────────────────────────────────────

  async createClass(
    schoolId: string,
    dto: CreateClassDto,
  ): Promise<SchoolClass> {
    await this.findOneOrThrow(schoolId);

    const existing = await this.classRepo.findOne({
      where: { schoolId, name: dto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Class "${dto.name}" already exists in this school.`,
      );
    }

    const classCode = this.generateClassCode(schoolId, dto.name, dto.year);
    const pinHash = await this.hashProvider.hashPassword(dto.pin);

    const schoolClass = this.classRepo.create({
      schoolId,
      name: dto.name,
      arm: dto.arm ?? null,
      year: dto.year ?? null,
      description: dto.description ?? null,
      classCode,
      pinHash,
      pinLastChangedAt: new Date(),
      defaultExamDurationMinutes: dto.defaultExamDurationMinutes ?? 60,
      defaultQuestionCount: dto.defaultQuestionCount ?? 40,
      totalStudents: 0,
      totalExamsCreated: 0,
      isActive: true,
    });

    return this.classRepo.save(schoolClass);
  }

  // ─── LIST CLASSES ─────────────────────────────────────────────────────────

  async findClasses(
    schoolId: string,
    filters: ClassFiltersDto,
  ): Promise<PaginatedResult<SchoolClass>> {
    await this.findOneOrThrow(schoolId);

    const {
      page,
      limit,
      search,
      sortBy = 'name',
      sortOrder = 'ASC',
      ...fieldFilters
    } = filters;

    const qb = this.classRepo
      .createQueryBuilder('c')
      .where('c.schoolId = :schoolId', { schoolId });

    if (search) {
      qb.andWhere('(c.name ILIKE :search OR c.arm ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (fieldFilters.isActive !== undefined) {
      const isActive =
        fieldFilters.isActive === true ||
        (fieldFilters.isActive as any) === 'true';
      qb.andWhere('c.isActive = :isActive', { isActive });
    }

    if (fieldFilters.year)
      qb.andWhere('c.year = :year', { year: fieldFilters.year });

    const sortMap: Record<string, string> = {
      name: 'c.name',
      createdAt: 'c.createdAt',
      totalStudents: 'c.totalStudents',
      totalExamsCreated: 'c.totalExamsCreated',
    };
    qb.orderBy(sortMap[sortBy] ?? 'c.name', sortOrder);

    return this.paginationProvider.paginateQueryBuilder(qb, { page, limit });
  }

  // ─── GET ONE CLASS ────────────────────────────────────────────────────────

  async findClass(schoolId: string, classId: string): Promise<SchoolClass> {
    return this.findClassOrThrow(schoolId, classId);
  }

  // ─── UPDATE CLASS ─────────────────────────────────────────────────────────

  async updateClass(
    schoolId: string,
    classId: string,
    dto: UpdateClassDto,
  ): Promise<SchoolClass> {
    const schoolClass = await this.findClassOrThrow(schoolId, classId);

    if (dto.name && dto.name !== schoolClass.name) {
      const conflict = await this.classRepo.findOne({
        where: { schoolId, name: dto.name },
      });
      if (conflict) {
        throw new ConflictException(
          `Class "${dto.name}" already exists in this school.`,
        );
      }
    }

    const { pin, ...rest } = dto;
    const updateData: Partial<SchoolClass> = { ...rest } as any;

    if (pin) {
      updateData.pinHash = await bcrypt.hash(pin, 10);
      updateData.pinLastChangedAt = new Date();
    }

    // await this.classRepo.update(classId, updateData);
    return this.findClassOrThrow(schoolId, classId);
  }

  // ─── ROTATE PIN ───────────────────────────────────────────────────────────

  async rotatePin(
    schoolId: string,
    classId: string,
    dto: RotatePinDto,
  ): Promise<{ classCode: string; pinLastChangedAt: Date }> {
    const schoolClass = await this.findClassOrThrow(schoolId, classId);
    const pinHash = await this.hashProvider.hashPassword(dto.newPin);
    schoolClass.rotatePin(pinHash);
    await this.classRepo.save(schoolClass);
    return {
      classCode: schoolClass.classCode,
      pinLastChangedAt: schoolClass.pinLastChangedAt!,
    };
  }

  // ─── VERIFY PIN (teacher login) ───────────────────────────────────────────

  async verifyPin(dto: VerifyPinDto): Promise<PinVerifyResult> {
    const schoolClass = await this.classRepo
      .createQueryBuilder('c')
      .addSelect('c.pinHash')
      .where('c.classCode = :classCode', { classCode: dto.classCode })
      .getOne();

    if (!schoolClass) {
      return { valid: false };
    }

    const valid = await this.hashProvider.comparePassword(
      dto.pin,
      schoolClass.pinHash,
    );
    if (!valid) return { valid: false };

    return {
      valid: true,
      schoolClass: {
        id: schoolClass.id,
        name: schoolClass.name,
        schoolId: schoolClass.schoolId,
        classCode: schoolClass.classCode,
        defaultExamDurationMinutes: schoolClass.defaultExamDurationMinutes,
        defaultQuestionCount: schoolClass.defaultQuestionCount,
      },
    };
  }

  // ─── DELETE CLASS ─────────────────────────────────────────────────────────

  async removeClass(
    schoolId: string,
    classId: string,
  ): Promise<{ id: string }> {
    await this.findClassOrThrow(schoolId, classId);

    // Check no students are currently enrolled
    const enrolled = await this.dataSource.query(
      `SELECT COUNT(*)::int AS count FROM student_profiles WHERE school_class_id = $1`,
      [classId],
    );
    if (enrolled[0]?.count > 0) {
      throw new BadRequestException(
        'Cannot delete a class with enrolled students. Remove or reassign students first.',
      );
    }

    await this.classRepo.delete(classId);
    return { id: classId };
  }

  // ─── BULK ENROLL STUDENTS INTO CLASS ──────────────────────────────────────

  async bulkEnroll(
    schoolId: string,
    dto: BulkEnrollDto,
  ): Promise<{ enrolled: number }> {
    await this.findOneOrThrow(schoolId);

    if (dto.schoolClassId) {
      await this.findClassOrThrow(schoolId, dto.schoolClassId);
    }

    await this.dataSource.query(
      `UPDATE student_profiles
       SET school_id = $1,
           school_class_id = $2
       WHERE id = ANY($3::uuid[])`,
      [schoolId, dto.schoolClassId ?? null, dto.studentProfileIds],
    );

    // Update cached totalStudents on school
    await this.dataSource.query(
      `UPDATE schools SET "totalStudents" = (
         SELECT COUNT(*) FROM student_profiles WHERE school_id = $1
       ) WHERE id = $1`,
      [schoolId],
    );

    // Update cached totalStudents on class
    if (dto.schoolClassId) {
      await this.dataSource.query(
        `UPDATE school_classes SET "totalStudents" = (
           SELECT COUNT(*) FROM student_profiles WHERE school_class_id = $1
         ) WHERE id = $1`,
        [dto.schoolClassId],
      );
    }

    return { enrolled: dto.studentProfileIds.length };
  }

  async findStudentsToEnroll(
    query: string,
    schoolId?: string,
  ): Promise<
    {
      id: string;
      name: string;
      email: string;
      admissionNo: string | null;
      currentSchool: string | null;
    }[]
  > {
    // Search users not yet enrolled in this school
    const results = await this.dataSource.query(
      `SELECT sp.id, 
              u."firstName" || ' ' || u."lastName" AS name,
              u.email,
              sp."admissionNo",
              sp."currentSchool",
              sp."schoolId"
       FROM student_profiles sp
       LEFT JOIN users u ON u.id = sp.user_id
       WHERE (
         LOWER(u.email) ILIKE $1
         OR sp."admissionNo" ILIKE $1
         OR u."firstName" ILIKE $1
         OR u."lastName" ILIKE $1
       )
       AND u.role = 'student'
       AND (sp.school_id IS NULL OR sp.school_id != $2)
       LIMIT 20`,
      [`%${query.toLowerCase()}%`, schoolId ?? null],
    );

    return results;
  }

  async enrollByIdentifier(
    schoolId: string,
    dto: { identifier: string; schoolClassId?: string },
  ): Promise<{ enrolled: number; studentProfileId: string }> {
    await this.findOneOrThrow(schoolId);

    // Find student by email or admissionNo
    const result = await this.dataSource.query(
      `SELECT sp.id FROM student_profiles sp
       LEFT JOIN users u ON u.id = sp.user_id
       WHERE LOWER(u.email) = LOWER($1) OR sp."admissionNo" = $1
       LIMIT 1`,
      [dto.identifier],
    );

    if (!result.length) {
      throw new NotFoundException(
        `No student found with email or admission number "${dto.identifier}".`,
      );
    }

    const studentProfileId = result[0].id;

    await this.dataSource.query(
      `UPDATE student_profiles
       SET school_id = $1, school_class_id = $2
       WHERE id = $3`,
      [schoolId, dto.schoolClassId ?? null, studentProfileId],
    );

    // Update cache
    await this.dataSource.query(
      `UPDATE schools SET "totalStudents" = (
         SELECT COUNT(*) FROM student_profiles WHERE school_id = $1
       ) WHERE id = $1`,
      [schoolId],
    );

    if (dto.schoolClassId) {
      await this.dataSource.query(
        `UPDATE school_classes SET "totalStudents" = (
           SELECT COUNT(*) FROM student_profiles WHERE school_class_id = $1
         ) WHERE id = $1`,
        [dto.schoolClassId],
      );
    }

    return { enrolled: 1, studentProfileId };
  }
  // ─── GET STUDENTS IN SCHOOL ───────────────────────────────────────────────
  // Returns student profiles belonging to this school.
  // Delegates to StudentProfileRepo since StudentProfile owns the FK.

  async getSchoolStudents(
    schoolId: string,
    classId?: string,
    page = 1,
    limit = 50,
  ) {
    await this.findOneOrThrow(schoolId);

    const qb = this.dataSource
      .createQueryBuilder()
      .select([
        'sp.id',
        'sp.currentClass',
        'sp.admissionNo',
        'sp.averageScore',
        'sp.totalExamsTaken',
        'sp.currentStreak',
        'sp.totalXp',
        'sp.level',
        'sp.levelTitle',
        'sp.school_class_id AS "schoolClassId"',
      ])
      .from('student_profiles', 'sp')
      .leftJoin('users', 'u', 'u.id = sp.user_id')
      .addSelect([
        'u.firstName',
        'u.lastName',
        'u.email',
        'u.avatarUrl',
        'u.isActive',
      ])
      .where('sp.school_id = :schoolId', { schoolId });

    if (classId) qb.andWhere('sp.school_class_id = :classId', { classId });

    const skip = (page - 1) * limit;
    const [data, total] = await qb
      .orderBy('sp."averageScore"', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasPreviousPage: page > 1,
        hasNextPage: page < Math.ceil(total / limit),
      },
    };
  }

  // ─── PRIVATE HELPERS ──────────────────────────────────────────────────────

  private async findOneOrThrow(id: string): Promise<School> {
    const school = await this.schoolRepo.findOne({
      where: { id },
      relations: ['classes', 'admins'],
    });
    if (!school) throw new NotFoundException(`School "${id}" not found.`);
    return school;
  }

  private async findClassOrThrow(
    schoolId: string,
    classId: string,
  ): Promise<SchoolClass> {
    const schoolClass = await this.classRepo.findOne({
      where: { id: classId, schoolId },
    });
    if (!schoolClass) {
      throw new NotFoundException(
        `Class "${classId}" not found in this school.`,
      );
    }
    return schoolClass;
  }

  private generateClassCode(
    schoolId: string,
    className: string,
    year?: number | null,
  ): string {
    const shortId = schoolId.split('-')[0].toUpperCase();
    const cleanName = className.replace(/\s+/g, '').toUpperCase().slice(0, 6);
    const yr = year ?? new Date().getFullYear();
    return `${shortId}-${cleanName}-${yr}`;
  }
}
