import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { StudentProfile } from './entities/student-profile.entity';
import { WeakTopic } from './entities/weak-topic.entity';
import { ExamSession } from './entities/exam-session.entity';
import { StudyStreak } from './entities/study-streak.entity';
import { StudyActivity } from './entities/study-activity.entity';
import { TopicMasteryHistory } from './entities/topic-mastery-history.entity';

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

import {
  LeaderboardResult,
  StudentOverview,
  StudentPerformance,
} from './types/students.types';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginatedResult } from 'src/common/pagination/pagination.interface';
import { StreakStatus, WeakTopicStatus } from 'src/common/enums/enums';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentProfile)
    private readonly profileRepo: Repository<StudentProfile>,

    @InjectRepository(WeakTopic)
    private readonly weakTopicRepo: Repository<WeakTopic>,

    @InjectRepository(ExamSession)
    private readonly sessionRepo: Repository<ExamSession>,

    @InjectRepository(StudyStreak)
    private readonly streakRepo: Repository<StudyStreak>,

    @InjectRepository(StudyActivity)
    private readonly activityRepo: Repository<StudyActivity>,

    @InjectRepository(TopicMasteryHistory)
    private readonly masteryRepo: Repository<TopicMasteryHistory>,

    private readonly dataSource: DataSource,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  // ─── FIND ONE (by profile id or user id) ─────────────────────────────────

  async findByProfileId(profileId: string): Promise<StudentProfile> {
    const profile = await this.profileRepo.findOne({
      where: { id: profileId },
      relations: ['weakTopics', 'streakHistory'],
    });
    if (!profile)
      throw new NotFoundException(`Student profile "${profileId}" not found.`);
    return profile;
  }

  async findByUserId(userId: string): Promise<StudentProfile> {
    const profile = await this.profileRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.weakTopics', 'weakTopics')
      .where('p.user_id = :userId', { userId })
      .getOne();
    if (!profile)
      throw new NotFoundException(`No student profile for user "${userId}".`);
    return profile;
  }

  // ─── LIST / SEARCH (admin) ────────────────────────────────────────────────

  async findAll(
    filters: StudentFiltersDto,
  ): Promise<PaginatedResult<StudentProfile>> {
    console.log('RAW filters:', JSON.stringify(filters));
    const {
      page,
      limit,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      ...fieldFilters
    } = filters;
    console.log(
      'hasSchool:',
      fieldFilters.hasSchool,
      typeof fieldFilters.hasSchool,
    );

    const qb = this.profileRepo
      .createQueryBuilder('p')
      .leftJoin('p.user', 'u')
      .addSelect([
        'u.id',
        'u.firstName',
        'u.lastName',
        'u.email',
        'u.avatarUrl',
        'u.isActive',
      ]);

    if (search) {
      qb.andWhere(
        '(u.firstName ILIKE :s OR u.lastName ILIKE :s OR u.email ILIKE :s OR p.admissionNo ILIKE :s)',
        { s: `%${search}%` },
      );
    }

    if (fieldFilters.schoolId)
      qb.andWhere('p.school_id = :schoolId', {
        schoolId: fieldFilters.schoolId,
      });

    if (fieldFilters.schoolClassId)
      qb.andWhere('p.school_class_id = :classId', {
        classId: fieldFilters.schoolClassId,
      });

    if (fieldFilters.examTarget)
      qb.andWhere(':examTarget = ANY(p.examTargets)', {
        examTarget: fieldFilters.examTarget,
      });

    const isActive = fieldFilters.isActive;

    if (isActive === true || (isActive as any) === 'true')
      qb.andWhere('u.isActive = true');
    else if (isActive === false || (isActive as any) === 'false')
      qb.andWhere('u.isActive = false');
    const hasSchool = fieldFilters.hasSchool;

    if (hasSchool === true || (hasSchool as any) === 'true') {
      qb.andWhere('p.school_id IS NOT NULL');
    } else if (hasSchool === false || (hasSchool as any) === 'false') {
      qb.andWhere('p.school_id IS NULL');
    }

    const sortMap: Record<string, string> = {
      createdAt: 'p.createdAt',
      totalXp: 'p.totalXp',
      averageScore: 'p.averageScore',
      currentStreak: 'p.currentStreak',
      totalExamsTaken: 'p.totalExamsTaken',
    };
    qb.orderBy(sortMap[sortBy] ?? 'p.createdAt', sortOrder);

    return this.paginationProvider.paginateQueryBuilder(qb, { page, limit });
  }

  // ─── DASHBOARD OVERVIEW ───────────────────────────────────────────────────

  async getOverview(profileId: string): Promise<StudentOverview> {
    const profile = await this.findByProfileId(profileId);

    const [recentSessions, weakTopics] = await Promise.all([
      this.sessionRepo.find({
        where: { studentProfileId: profileId },
        order: { createdAt: 'DESC' },
        take: 5,
      }),
      this.weakTopicRepo.find({
        where: { studentProfileId: profileId, status: WeakTopicStatus.ACTIVE },
        order: { averageScore: 'ASC' },
        take: 4,
      }),
    ]);

    const daysUntilExam = profile.examDate
      ? Math.ceil(
          (new Date(profile.examDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

    return {
      profile,
      stats: {
        totalXp: profile.totalXp,
        level: profile.level,
        levelTitle: profile.levelTitle,
        currentStreak: profile.currentStreak,
        longestStreak: profile.longestStreak,
        averageScore: profile.averageScore,
        totalExamsTaken: profile.totalExamsTaken,
        totalQuestionsAttempted: profile.totalQuestionsAttempted,
        totalQuestionsCorrect: profile.totalQuestionsCorrect,
        accuracyRate: profile.accuracyRate,
        totalMinutesStudied: profile.totalMinutesStudied,
        bestScore: profile.bestScore,
        worstScore: profile.worstScore,
        leaderboardRank: profile.leaderboardRank,
        percentileStanding: profile.percentileStanding,
      },
      recentSessions,
      weakTopics,
      daysUntilExam,
    };
  }

  // ─── PERFORMANCE ANALYTICS ────────────────────────────────────────────────

  async getPerformance(
    profileId: string,
    days = 90,
  ): Promise<StudentPerformance> {
    await this.findByProfileId(profileId); // 404 guard

    const since = new Date();
    since.setDate(since.getDate() - days);

    const [sessions, activities, masteryHistory] = await Promise.all([
      this.sessionRepo.find({
        where: { studentProfileId: profileId },
        order: { createdAt: 'DESC' },
        take: 100,
      }),
      this.activityRepo
        .createQueryBuilder('a')
        .where('a.studentProfileId = :profileId', { profileId })
        .andWhere('a.date >= :since', {
          since: since.toISOString().split('T')[0],
        })
        .orderBy('a.date', 'ASC')
        .getMany(),
      this.masteryRepo.find({
        where: { studentProfile: { id: profileId } },
        order: { recordedAt: 'DESC' },
        take: 200,
      }),
    ]);

    const completedSessions = sessions.filter((s) => s.isCompleted);
    const totalQuestions = completedSessions.reduce(
      (a, s) => a + s.totalQuestions,
      0,
    );
    const correctAnswers = completedSessions.reduce(
      (a, s) => a + s.questionsCorrect,
      0,
    );
    const totalTimeSpentMinutes = Math.round(
      completedSessions.reduce((a, s) => a + s.timeSpentSeconds, 0) / 60,
    );
    const averageScore =
      completedSessions.length > 0
        ? completedSessions.reduce((a, s) => a + s.percentage, 0) /
          completedSessions.length
        : 0;

    // ── Subject performance from cached profile jsonb ──
    // (cache is kept current by recordActivity + updateProfileCaches)

    // ── Weekly trend from study activities ──
    const weeklyTrend = this.buildWeeklyTrend(activities);

    // ── Study heatmap (last `days` days) ──
    const studyHeatmap = this.buildHeatmap(activities, days);

    // ── Recent activity from sessions ──
    const recentActivity = completedSessions.slice(0, 20).map((s) => ({
      date: s.createdAt.toISOString().split('T')[0],
      examType: s.examType ?? 'school_exam',
      subject: (s.subjects?.[0] as string) ?? '',
      score: Math.round(s.percentage),
      timeSpent: Math.round(s.timeSpentSeconds / 60),
      questionsCorrect: s.questionsCorrect,
      totalQuestions: s.totalQuestions,
    }));

    // ── Topic mastery from history ──
    const topicMastery = this.buildTopicMastery(masteryHistory);

    return {
      overall: {
        averageScore: Math.round(averageScore),
        totalQuestions,
        correctAnswers,
        accuracyRate:
          totalQuestions > 0
            ? Math.round((correctAnswers / totalQuestions) * 100)
            : 0,
        totalTimeSpentMinutes,
        streak: 0, // filled from profile in controller
        bestStreak: 0,
        improvement: this.calcImprovement(completedSessions),
      },
      subjectPerformance: [], // built from profile.subjectPerformance cache
      topicMastery,
      weeklyTrend,
      examPerformance: [], // built from profile.examPerformance cache
      studyHeatmap,
      recentActivity,
    };
  }

  // ─── SESSION HISTORY ──────────────────────────────────────────────────────

  async getSessionHistory(
    profileId: string,
    filters: SessionHistoryFiltersDto,
  ): Promise<PaginatedResult<ExamSession>> {
    await this.findByProfileId(profileId);

    const {
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      ...fieldFilters
    } = filters;

    const qb = this.sessionRepo
      .createQueryBuilder('s')
      .where('s.studentProfileId = :profileId', { profileId });

    if (fieldFilters.examType)
      qb.andWhere('s.examType = :examType', {
        examType: fieldFilters.examType,
      });

    if (fieldFilters.subject)
      qb.andWhere(':subject = ANY(s.subjects)', {
        subject: fieldFilters.subject,
      });

    if (fieldFilters.from)
      qb.andWhere('s.createdAt >= :from', { from: fieldFilters.from });

    if (fieldFilters.to)
      qb.andWhere('s.createdAt <= :to', { to: fieldFilters.to });

    const sortMap: Record<string, string> = {
      createdAt: 's.createdAt',
      percentage: 's.percentage',
      scaledScore: 's.scaledScore',
      timeSpentSeconds: 's.timeSpentSeconds',
    };
    qb.orderBy(sortMap[sortBy] ?? 's.createdAt', sortOrder);

    return this.paginationProvider.paginateQueryBuilder(qb, { page, limit });
  }

  // ─── WEAK TOPICS ──────────────────────────────────────────────────────────

  async getWeakTopics(
    profileId: string,
    filters: WeakTopicFiltersDto,
  ): Promise<PaginatedResult<WeakTopic>> {
    await this.findByProfileId(profileId);

    const {
      page,
      limit,
      sortBy = 'averageScore',
      sortOrder = 'ASC',
      ...fieldFilters
    } = filters;

    const qb = this.weakTopicRepo
      .createQueryBuilder('w')
      .where('w.studentProfileId = :profileId', { profileId });

    if (fieldFilters.subject)
      qb.andWhere('w.subject = :subject', { subject: fieldFilters.subject });

    if (fieldFilters.status)
      qb.andWhere('w.status = :status', { status: fieldFilters.status });

    const sortMap: Record<string, string> = {
      averageScore: 'w.averageScore',
      timesPracticed: 'w.timesPracticed',
      lastPracticedAt: 'w.lastPracticedAt',
      improvementRate: 'w.improvementRate',
    };
    qb.orderBy(sortMap[sortBy] ?? 'w.averageScore', sortOrder);

    return this.paginationProvider.paginateQueryBuilder(qb, { page, limit });
  }

  // ─── STUDY ACTIVITY / HEATMAP ─────────────────────────────────────────────

  async getStudyActivity(
    profileId: string,
    query: ActivityQueryDto,
  ): Promise<StudyActivity[]> {
    await this.findByProfileId(profileId);

    const qb = this.activityRepo
      .createQueryBuilder('a')
      .where('a.studentProfileId = :profileId', { profileId });

    if (query.from) {
      qb.andWhere('a.date >= :from', { from: query.from });
    } else {
      const since = new Date();
      since.setDate(since.getDate() - (query.days ?? 90));
      qb.andWhere('a.date >= :since', {
        since: since.toISOString().split('T')[0],
      });
    }

    if (query.to) qb.andWhere('a.date <= :to', { to: query.to });

    return qb.orderBy('a.date', 'ASC').getMany();
  }

  // ─── STREAK INFO ──────────────────────────────────────────────────────────

  async getStreakInfo(profileId: string) {
    const profile = await this.findByProfileId(profileId);
    const streak = await this.streakRepo.findOne({
      where: { studentProfileId: profileId, status: StreakStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    const today = new Date().toISOString().split('T')[0];
    const lastStudy = profile.lastStudyDate
      ? new Date(profile.lastStudyDate).toISOString().split('T')[0]
      : null;

    return {
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      lastStudyDate: profile.lastStudyDate,
      shields: profile.streakShields,
      milestones: {
        day3: (streak?.milestones?.day3 ?? null) !== null,
        day7: (streak?.milestones?.day7 ?? null) !== null,
        day14: (streak?.milestones?.day14 ?? null) !== null,
        day30: (streak?.milestones?.day30 ?? null) !== null,
        day100: (streak?.milestones?.day100 ?? null) !== null,
      },
      todayComplete: lastStudy === today,
    };
  }

  // ─── LEADERBOARD ──────────────────────────────────────────────────────────

  async getLeaderboard(params: {
    page: number;
    limit: number;
    currentProfileId?: string;
    schoolId?: string;
  }): Promise<LeaderboardResult> {
    const { page = 1, limit = 50, currentProfileId, schoolId } = params;

    const qb = this.profileRepo
      .createQueryBuilder('p')
      .leftJoin('p.user', 'u')
      .addSelect(['u.firstName', 'u.lastName', 'u.avatarUrl'])
      .orderBy('p.totalXp', 'DESC');

    if (schoolId) qb.where('p.school_id = :schoolId', { schoolId });

    const skip = (page - 1) * limit;
    const [profiles, total] = await qb.skip(skip).take(limit).getManyAndCount();

    const entries = profiles.map((p, idx) => ({
      rank: skip + idx + 1,
      studentProfileId: p.id,
      name: `${(p.user as any)?.firstName ?? ''} ${(p.user as any)?.lastName ?? ''}`.trim(),
      avatarUrl: (p.user as any)?.avatarUrl ?? null,
      totalXp: p.totalXp,
      level: p.level,
      levelTitle: p.levelTitle,
      currentStreak: p.currentStreak,
      averageScore: p.averageScore,
      schoolName: p.currentSchool,
      isCurrentUser: p.id === currentProfileId,
    }));

    let currentUserEntry = entries.find((e) => e.isCurrentUser) ?? null;

    // If current user is not on this page, fetch their rank separately
    if (!currentUserEntry && currentProfileId) {
      const rank = await this.profileRepo
        .createQueryBuilder('p')
        .where(
          'p.totalXp > (SELECT totalXp FROM student_profiles WHERE id = :id)',
          {
            id: currentProfileId,
          },
        )
        .getCount();

      const userProfile = await this.findByProfileId(currentProfileId);
      currentUserEntry = {
        rank: rank + 1,
        studentProfileId: userProfile.id,
        name: '',
        avatarUrl: null,
        totalXp: userProfile.totalXp,
        level: userProfile.level,
        levelTitle: userProfile.levelTitle,
        currentStreak: userProfile.currentStreak,
        averageScore: userProfile.averageScore,
        schoolName: userProfile.currentSchool,
        isCurrentUser: true,
      };
    }

    return {
      entries,
      currentUserEntry,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── UPDATE PROFILE ───────────────────────────────────────────────────────

  async updateProfile(
    profileId: string,
    dto: UpdateStudentProfileDto,
  ): Promise<StudentProfile> {
    await this.findByProfileId(profileId); // 404 guard
    await this.profileRepo.update(profileId, dto as any);
    return this.findByProfileId(profileId);
  }

  // ─── ADMIN UPDATE ─────────────────────────────────────────────────────────

  async adminUpdate(
    profileId: string,
    dto: AdminUpdateStudentDto,
  ): Promise<StudentProfile> {
    await this.findByProfileId(profileId);
    const { isActive, ...profileFields } = dto;

    await this.dataSource.transaction(async (manager) => {
      if (Object.keys(profileFields).length) {
        await manager.update(StudentProfile, profileId, profileFields as any);
      }
      if (isActive !== undefined) {
        // isActive lives on User, not StudentProfile
        const profile = await manager.findOne(StudentProfile, {
          where: { id: profileId },
          relations: ['user'],
        });
        if (profile?.user) {
          await manager.update(
            profile.user.constructor as any,
            profile.user.id,
            { isActive },
          );
        }
      }
    });

    return this.findByProfileId(profileId);
  }

  // ─── ENROLL IN SCHOOL ─────────────────────────────────────────────────────

  async enrollInSchool(dto: EnrollStudentDto): Promise<StudentProfile> {
    const profile = await this.findByProfileId(dto.studentProfileId);

    if (profile.schoolId && profile.schoolId !== dto.schoolId) {
      throw new BadRequestException(
        'Student is already enrolled in another school. Remove them first.',
      );
    }

    await this.profileRepo.update(dto.studentProfileId, {
      schoolId: dto.schoolId,
      schoolClassId: dto.schoolClassId ?? null,
      admissionNo: dto.admissionNo ?? profile.admissionNo,
    });

    return this.findByProfileId(dto.studentProfileId);
  }

  // ─── REMOVE FROM SCHOOL ───────────────────────────────────────────────────

  async removeFromSchool(profileId: string): Promise<StudentProfile> {
    await this.findByProfileId(profileId);
    await this.profileRepo.update(profileId, {
      schoolId: null,
      schoolClassId: null,
    });
    return this.findByProfileId(profileId);
  }

  // ─── AWARD XP ─────────────────────────────────────────────────────────────
  // Called by ExamSessions module after a completed session

  async awardXp(
    dto: AwardXpDto,
  ): Promise<{ totalXp: number; level: number; levelTitle: string }> {
    const profile = await this.findByProfileId(dto.studentProfileId);
    profile.addXp(dto.xp);
    await this.profileRepo.save(profile);
    return {
      totalXp: profile.totalXp,
      level: profile.level,
      levelTitle: profile.levelTitle,
    };
  }

  // ─── RECORD STUDY ACTIVITY ────────────────────────────────────────────────
  // Called by ExamSessions module after session completes.
  // Upserts today's StudyActivity and updates StudentProfile caches.

  async recordActivity(dto: RecordActivityDto): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    await this.dataSource.transaction(async (manager) => {
      // 1. Upsert StudyActivity for today
      let activity = await manager.findOne(StudyActivity, {
        where: { studentProfileId: dto.studentProfileId, date: today as any },
      });

      if (!activity) {
        activity = manager.create(StudyActivity, {
          studentProfileId: dto.studentProfileId,
          date: today as any,
          minutesStudied: 0,
          questionsAttempted: 0,
          questionsCorrect: 0,
          examSessionsCompleted: 0,
          xpEarned: 0,
          isStreakDay: false,
          goalMet: false,
        });
      }

      activity.minutesStudied += dto.minutesStudied;
      activity.questionsAttempted += dto.questionsAttempted;
      activity.questionsCorrect += dto.questionsCorrect;
      activity.examSessionsCompleted += 1;
      activity.xpEarned += dto.xpEarned ?? 0;
      activity.averageScore =
        activity.questionsAttempted > 0
          ? (activity.questionsCorrect / activity.questionsAttempted) * 100
          : 0;

      if (dto.subjectBreakdown?.length) {
        const existing = activity.subjects ?? [];
        for (const s of dto.subjectBreakdown) {
          const found = existing.find((e) => e.subject === s.subject);
          if (found) {
            found.minutes += s.minutes;
            found.questionsAttempted += s.questionsAttempted;
            found.questionsCorrect += s.questionsCorrect;
            found.score =
              found.questionsAttempted > 0
                ? (found.questionsCorrect / found.questionsAttempted) * 100
                : 0;
          } else {
            existing.push(s);
          }
        }
        activity.subjects = existing;
      }

      await manager.save(activity);

      // 2. Update StudentProfile aggregate caches
      await manager.increment(
        StudentProfile,
        { id: dto.studentProfileId },
        'totalQuestionsAttempted',
        dto.questionsAttempted,
      );
      await manager.increment(
        StudentProfile,
        { id: dto.studentProfileId },
        'totalQuestionsCorrect',
        dto.questionsCorrect,
      );
      await manager.increment(
        StudentProfile,
        { id: dto.studentProfileId },
        'totalMinutesStudied',
        dto.minutesStudied,
      );

      // 3. Update streak
      await this.updateStreak(dto.studentProfileId, today, manager);
    });
  }

  // ─── UPDATE PROFILE CACHES AFTER SESSION ──────────────────────────────────
  // Called by ExamSessions module after scoring is complete.

  async updateAfterSession(params: {
    profileId: string;
    percentage: number;
    examType: string | null;
    subjects: string[];
    subjectScores:
      | { subject: string; score: number; total: number; percentage: number }[]
      | null;
  }): Promise<void> {
    const profile = await this.findByProfileId(params.profileId);

    // Update best/worst scores
    if (profile.bestScore === null || params.percentage > profile.bestScore) {
      profile.bestScore = params.percentage;
    }
    if (profile.worstScore === null || params.percentage < profile.worstScore) {
      profile.worstScore = params.percentage;
    }

    // Recalculate overall average
    const newTotal = profile.totalExamsTaken + 1;
    profile.averageScore =
      (profile.averageScore * profile.totalExamsTaken + params.percentage) /
      newTotal;
    profile.totalExamsTaken = newTotal;

    // Update per-exam cache
    if (params.examType) {
      const examPerf = profile.examPerformance ?? {};
      const existing = examPerf[params.examType] ?? {
        examsTaken: 0,
        bestScore: 0,
        worstScore: 100,
        averageScore: 0,
        lastAttemptAt: '',
      };
      existing.examsTaken += 1;
      existing.bestScore = Math.max(existing.bestScore, params.percentage);
      existing.worstScore = Math.min(existing.worstScore, params.percentage);
      existing.averageScore =
        (existing.averageScore * (existing.examsTaken - 1) +
          params.percentage) /
        existing.examsTaken;
      existing.lastAttemptAt = new Date().toISOString();
      examPerf[params.examType] = existing;
      profile.examPerformance = examPerf;
    }

    // Update per-subject cache
    if (params.subjectScores?.length) {
      const subPerf = profile.subjectPerformance ?? {};
      for (const s of params.subjectScores) {
        const existing = subPerf[s.subject] ?? {
          averageScore: 0,
          questionsAttempted: 0,
          questionsCorrect: 0,
          totalMinutes: 0,
          lastPracticedAt: '',
        };
        const newAttempts = existing.questionsAttempted + s.total;
        const newCorrect =
          existing.questionsCorrect +
          Math.round((s.percentage / 100) * s.total);
        existing.questionsAttempted = newAttempts;
        existing.questionsCorrect = newCorrect;
        existing.averageScore =
          newAttempts > 0 ? (newCorrect / newAttempts) * 100 : 0;
        existing.lastPracticedAt = new Date().toISOString();
        subPerf[s.subject] = existing;
      }
      profile.subjectPerformance = subPerf;
    }

    await this.profileRepo.save(profile);
  }

  // ─── TOPIC MASTERY HISTORY ────────────────────────────────────────────────

  async getTopicMasteryHistory(profileId: string, subject?: string) {
    await this.findByProfileId(profileId);

    const qb = this.masteryRepo
      .createQueryBuilder('h')
      .where('h.student_profile_id = :profileId', { profileId })
      .orderBy('h.recordedAt', 'DESC');

    if (subject) qb.andWhere('h.subject = :subject', { subject });

    return qb.take(200).getMany();
  }

  // ─── PRIVATE HELPERS ──────────────────────────────────────────────────────

  private async updateStreak(
    profileId: string,
    today: string,
    manager: any,
  ): Promise<void> {
    const profile = await manager.findOne(StudentProfile, {
      where: { id: profileId },
    });
    if (!profile) return;

    const lastStudy = profile.lastStudyDate
      ? new Date(profile.lastStudyDate).toISOString().split('T')[0]
      : null;

    if (lastStudy === today) return; // already recorded today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let streak = await manager.findOne(StudyStreak, {
      where: { studentProfileId: profileId, status: StreakStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    if (!streak || lastStudy !== yesterdayStr) {
      // Streak broken — start a new one
      if (streak) {
        streak.status = StreakStatus.BROKEN;
        streak.endDate = new Date();
        await manager.save(streak);
      }
      streak = manager.create(StudyStreak, {
        studentProfileId: profileId,
        currentStreak: 1,
        longestStreak: Math.max(1, profile.longestStreak),
        status: StreakStatus.ACTIVE,
        startDate: new Date(today),
        lastStudyDate: new Date(today),
        endDate: null,
        milestones: null,
      });
    } else {
      // Continuing streak
      streak.currentStreak += 1;
      streak.lastStudyDate = new Date(today);
      streak.longestStreak = Math.max(
        streak.longestStreak,
        streak.currentStreak,
      );

      // Check milestones
      const milestones = streak.milestones ?? {};
      const cs = streak.currentStreak;
      if (cs >= 3 && !milestones.day3) milestones.day3 = new Date();
      if (cs >= 7 && !milestones.day7) milestones.day7 = new Date();
      if (cs >= 14 && !milestones.day14) milestones.day14 = new Date();
      if (cs >= 30 && !milestones.day30) milestones.day30 = new Date();
      if (cs >= 100 && !milestones.day100) milestones.day100 = new Date();
      streak.milestones = milestones;
    }

    await manager.save(streak);

    // Sync profile streak cache
    profile.currentStreak = streak.currentStreak;
    profile.longestStreak = Math.max(
      profile.longestStreak,
      streak.currentStreak,
    );
    profile.lastStudyDate = new Date(today);
    await manager.save(profile);
  }

  private buildWeeklyTrend(activities: StudyActivity[]) {
    const weeks: Record<
      string,
      { score: number; count: number; questions: number; minutes: number }
    > = {};

    for (const a of activities) {
      const date = new Date(a.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toISOString().split('T')[0];

      if (!weeks[key])
        weeks[key] = { score: 0, count: 0, questions: 0, minutes: 0 };
      weeks[key].score += a.averageScore;
      weeks[key].count += 1;
      weeks[key].questions += a.questionsAttempted;
      weeks[key].minutes += a.minutesStudied;
    }

    return Object.entries(weeks).map(([week, v]) => ({
      week,
      score: v.count > 0 ? Math.round(v.score / v.count) : 0,
      questionsAttempted: v.questions,
      minutesStudied: v.minutes,
    }));
  }

  private buildHeatmap(activities: StudyActivity[], days: number) {
    const map: Record<string, { count: number; minutesStudied: number }> = {};
    for (const a of activities) {
      const key = new Date(a.date).toISOString().split('T')[0];
      map[key] = {
        count: a.examSessionsCompleted,
        minutesStudied: a.minutesStudied,
      };
    }

    const result: { date: string; count: number; minutesStudied: number }[] =
      [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      result.push({
        date: key,
        ...(map[key] ?? { count: 0, minutesStudied: 0 }),
      });
    }
    return result;
  }

  private buildTopicMastery(history: TopicMasteryHistory[]) {
    const latest: Record<string, TopicMasteryHistory> = {};
    for (const h of history) {
      const key = `${h.subject}::${h.topic}`;
      if (!latest[key]) latest[key] = h; // already sorted DESC
    }

    return Object.values(latest).map((h) => ({
      subject: h.subject as string,
      topic: h.topic,
      score: h.masteryScore,
      masteryLevel: this.scoreToMastery(h.masteryScore),
      questionsAttempted: 0, // not stored in history — enriched via weak topics if needed
      improvement: 0,
    }));
  }

  private scoreToMastery(
    score: number,
  ): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (score >= 85) return 'expert';
    if (score >= 70) return 'advanced';
    if (score >= 50) return 'intermediate';
    return 'beginner';
  }

  private calcImprovement(sessions: ExamSession[]): number {
    if (sessions.length < 2) return 0;
    const recent = sessions.slice(0, Math.ceil(sessions.length / 2));
    const older = sessions.slice(Math.ceil(sessions.length / 2));
    const recentAvg =
      recent.reduce((a, s) => a + s.percentage, 0) / recent.length;
    const olderAvg = older.reduce((a, s) => a + s.percentage, 0) / older.length;
    return olderAvg > 0
      ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100)
      : 0;
  }
}
