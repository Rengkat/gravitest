import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import {
  BulkDeleteDto,
  BulkToggleDto,
  QuestionFiltersDto,
  UpdateQuestionDto,
} from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionAnswer } from './entities/question-answer.entity';
import { QuestionOption } from './entities/question-option.entity';
import { QuestionExplanation } from './entities/question-explanation.entity';
import { DataSource } from 'typeorm';
import { BulkImportDto, BulkImportResult } from './dto/BulkQuestionsImport.dto';
import { QuestionBankStats } from './types/interface';
import { QuestionType } from 'src/common/enums/enums';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginatedResult } from 'src/common/pagination/pagination.interface';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(QuestionOption)
    private readonly questionOptionRepository: Repository<QuestionOption>,

    @InjectRepository(QuestionAnswer)
    private readonly questionAnswerRepository: Repository<QuestionAnswer>,

    @InjectRepository(QuestionExplanation)
    private readonly questionExplanationRepository: Repository<QuestionExplanation>,

    private readonly dataSource: DataSource,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  // ─── CREATE ────────────────────────────────────────────────────────────────
  async create(dto: CreateQuestionDto): Promise<Question> {
    this.validateQuestionTypeConstraints(dto);

    return this.dataSource.transaction(async (manager) => {
      // 1. Persist core question
      const question = manager.create(Question, {
        questionNumber: dto.questionNumber ?? null,
        examType: dto.examType,
        subject: dto.subject,
        year: dto.year,
        questionText: dto.questionText,
        questionImageUrl: dto.questionImageUrl ?? null,
        difficulty: dto.difficulty,
        type: dto.type,
        topic: dto.topic ?? null,
        isActive: dto.isActive ?? false, // default draft until published
      });
      const savedQuestion = await manager.save(question);

      // 2. Options (MCQ / TRUE_FALSE / OBJECTIVE)
      if (dto.options?.length) {
        const options = dto.options.map((o, idx) =>
          manager.create(QuestionOption, {
            label: o.label,
            text: o.text,
            imageUrl: o.imageUrl ?? null,
            order: o.order ?? idx,
            question: savedQuestion,
          }),
        );
        await manager.save(options);

        // 3. Answer — resolve the UUID of the correct option
        if (dto.answer) {
          const correctOption = options.find(
            (o) => o.label === dto.answer!.correctLabel,
          );
          if (!correctOption) {
            throw new BadRequestException(
              `Answer label "${dto.answer.correctLabel}" does not match any provided option.`,
            );
          }
          const answer = manager.create(QuestionAnswer, {
            correctLabel: dto.answer.correctLabel,
            correctOptionId: correctOption.id,
            question: savedQuestion,
          });
          await manager.save(answer);
        }
      }

      // 4. Explanations
      if (dto.explanations?.length) {
        const explanations = dto.explanations.map((e) =>
          manager.create(QuestionExplanation, {
            text: e.text,
            imageUrl: e.imageUrl ?? null,
            videoUrl: e.videoUrl ?? null,
            question: savedQuestion,
          }),
        );
        await manager.save(explanations);
      }

      return this.findOneOrThrow(savedQuestion.id);
    });
  }

  // ─── LIST / SEARCH ─────────────────────────────────────────────────────────

  async findAll(
    filters: QuestionFiltersDto,
  ): Promise<PaginatedResult<Question>> {
    const {
      page = 1,
      limit = 50,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      ...fieldFilters
    } = filters;

    const qb = this.questionRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.options', 'options')
      .leftJoinAndSelect('q.answer', 'answer')
      .leftJoinAndSelect('q.explanations', 'explanations');

    // ── Field filters ──
    if (fieldFilters.examType)
      qb.andWhere('q.examType = :examType', {
        examType: fieldFilters.examType,
      });
    if (fieldFilters.subject)
      qb.andWhere('q.subject = :subject', { subject: fieldFilters.subject });
    if (fieldFilters.year)
      qb.andWhere('q.year = :year', { year: fieldFilters.year });
    if (fieldFilters.type)
      qb.andWhere('q.type = :type', { type: fieldFilters.type });
    if (fieldFilters.difficulty)
      qb.andWhere('q.difficulty = :difficulty', {
        difficulty: fieldFilters.difficulty,
      });
    if (fieldFilters.topic)
      qb.andWhere('q.topic ILIKE :topic', { topic: `%${fieldFilters.topic}%` });
    if (fieldFilters.isActive !== undefined)
      qb.andWhere('q.isActive = :isActive', {
        isActive: fieldFilters.isActive,
      });

    // ── Scope (mutually exclusive — only one block runs) ──
    if (fieldFilters.classId && fieldFilters.schoolId) {
      // Class-specific questions + school-wide questions for that school
      qb.andWhere(
        '(q.schoolId = :schoolId AND q.classId = :classId) OR (q.schoolId = :schoolId AND q.classId IS NULL)',
        { schoolId: fieldFilters.schoolId, classId: fieldFilters.classId },
      );
    } else if (fieldFilters.schoolId && fieldFilters.schoolId !== 'null') {
      // All questions for this school (class-specific + general)
      qb.andWhere('q.schoolId = :schoolId', {
        schoolId: fieldFilters.schoolId,
      });
    } else {
      // Platform bank only
      qb.andWhere('q.schoolId IS NULL');
    }

    // ── Full-text search ──
    if (search) {
      qb.andWhere('(q.questionText ILIKE :search OR q.topic ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // ── Sort + paginate ──
    const allowedSorts: Record<string, string> = {
      createdAt: 'q.createdAt',
      year: 'q.year',
      difficulty: 'q.difficulty',
      examType: 'q.examType',
      subject: 'q.subject',
    };
    qb.orderBy(allowedSorts[sortBy] ?? 'q.createdAt', sortOrder);
    return this.paginationProvider.paginateQueryBuilder(qb, { page, limit });
  }

  // ─── FIND ONE ──────────────────────────────────────────────────────────────

  async findOne(id: string): Promise<Question> {
    return this.findOneOrThrow(id);
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findOneOrThrow(id);
    this.validateQuestionTypeConstraints(dto);

    return this.dataSource.transaction(async (manager) => {
      // Update scalar fields
      const coreFields: Partial<Question> = {};
      if (dto.examType !== undefined) coreFields.examType = dto.examType;
      if (dto.subject !== undefined) coreFields.subject = dto.subject;
      if (dto.year !== undefined) coreFields.year = dto.year;
      if (dto.questionText !== undefined)
        coreFields.questionText = dto.questionText;
      if (dto.questionImageUrl !== undefined)
        coreFields.questionImageUrl = dto.questionImageUrl ?? null;
      if (dto.difficulty !== undefined) coreFields.difficulty = dto.difficulty;
      if (dto.type !== undefined) coreFields.type = dto.type;
      if (dto.topic !== undefined) coreFields.topic = dto.topic ?? null;
      if (dto.isActive !== undefined) coreFields.isActive = dto.isActive;

      await manager.update(Question, id, coreFields);

      // Replace options + answer if supplied
      if (dto.options !== undefined) {
        await manager.delete(QuestionOption, { question: { id } });
        await manager.delete(QuestionAnswer, { question: { id } });

        const savedOptions = await manager.save(
          dto.options.map((o, idx) =>
            manager.create(QuestionOption, {
              label: o.label,
              text: o.text,
              imageUrl: o.imageUrl ?? null,
              order: o.order ?? idx,
              question: { id } as Question,
            }),
          ),
        );

        if (dto.answer) {
          const correct = savedOptions.find(
            (o) => o.label === dto.answer!.correctLabel,
          );
          if (!correct) {
            throw new BadRequestException(
              `Answer label "${dto.answer.correctLabel}" does not match any updated option.`,
            );
          }
          await manager.save(
            manager.create(QuestionAnswer, {
              correctLabel: dto.answer.correctLabel,
              correctOptionId: correct.id,
              question: { id } as Question,
            }),
          );
        }
      }

      // Replace explanations if supplied
      if (dto.explanations !== undefined) {
        await manager.delete(QuestionExplanation, { question: { id } });
        if (dto.explanations.length) {
          await manager.save(
            dto.explanations.map((e) =>
              manager.create(QuestionExplanation, {
                text: e.text,
                imageUrl: e.imageUrl ?? null,
                videoUrl: e.videoUrl ?? null,
                question: { id } as Question,
              }),
            ),
          );
        }
      }

      return this.findOneOrThrow(id);
    });
  }

  // ─── PUBLISH / TOGGLE ACTIVE ───────────────────────────────────────────────

  async toggleActive(id: string, isActive: boolean): Promise<Question> {
    const question = await this.findOneOrThrow(id);

    if (isActive) {
      this.assertPublishable(question);
    }

    await this.questionRepository.update(id, { isActive });
    return this.findOneOrThrow(id);
  }

  // ─── BULK TOGGLE ──────────────────────────────────────────────────────────

  async bulkToggleActive(dto: BulkToggleDto): Promise<{ affected: number }> {
    if (!dto.ids?.length) throw new BadRequestException('No IDs provided.');
    const result = await this.questionRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: dto.isActive })
      .whereInIds(dto.ids)
      .execute();
    return { affected: result.affected ?? 0 };
  }

  // ─── SOFT DELETE (toggle inactive) ────────────────────────────────────────

  async remove(id: string): Promise<{ id: string }> {
    await this.findOneOrThrow(id);
    await this.questionRepository.delete(id);
    return { id };
  }

  // ─── BULK DELETE ──────────────────────────────────────────────────────────

  async bulkDelete(dto: BulkDeleteDto): Promise<{ affected: number }> {
    if (!dto.ids?.length) throw new BadRequestException('No IDs provided.');
    const result = await this.questionRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(dto.ids)
      .execute();
    return { affected: result.affected ?? 0 };
  }

  // ─── DUPLICATE ────────────────────────────────────────────────────────────

  async duplicate(id: string): Promise<Question> {
    const original = await this.findOneOrThrow(id);

    return this.dataSource.transaction(async (manager) => {
      const copy = manager.create(Question, {
        examType: original.examType,
        subject: original.subject,
        year: original.year,
        questionText: `${original.questionText} (Copy)`,
        questionImageUrl: original.questionImageUrl,
        difficulty: original.difficulty,
        type: original.type,
        topic: original.topic,
        isActive: false, // copies start inactive
      });
      const savedCopy = await manager.save(copy);

      if (original.options?.length) {
        const copiedOptions = await manager.save(
          original.options.map((o) =>
            manager.create(QuestionOption, {
              label: o.label,
              text: o.text,
              imageUrl: o.imageUrl,
              order: o.order,
              question: savedCopy,
            }),
          ),
        );

        if (original.answer) {
          const matchingOption = copiedOptions.find(
            (o) => o.label === original.answer.correctLabel,
          );
          if (matchingOption) {
            await manager.save(
              manager.create(QuestionAnswer, {
                correctLabel: original.answer.correctLabel,
                correctOptionId: matchingOption.id,
                question: savedCopy,
              }),
            );
          }
        }
      }

      if (original.explanations?.length) {
        await manager.save(
          original.explanations.map((e) =>
            manager.create(QuestionExplanation, {
              text: e.text,
              imageUrl: e.imageUrl,
              videoUrl: e.videoUrl,
              question: savedCopy,
            }),
          ),
        );
      }

      return this.findOneOrThrow(savedCopy.id);
    });
  }

  // ─── STATS ────────────────────────────────────────────────────────────────

  async getBankStats(
    schoolId?: string,
    classId?: string,
  ): Promise<QuestionBankStats> {
    const base = this.questionRepository.createQueryBuilder('q');
    if (classId && schoolId) {
      base
        .where('q.schoolId = :schoolId', { schoolId })
        .andWhere('q.classId = :classId', { classId });
    } else if (schoolId && schoolId !== 'null') {
      base.where('q.schoolId = :schoolId', { schoolId });
    } else {
      base.where('q.schoolId IS NULL');
    }

    const [
      total,
      active,
      byExamRaw,
      bySubjectRaw,
      byDifficultyRaw,
      byTypeRaw,
      byYearRaw,
      withExplanations,
      withImages,
    ] = await Promise.all([
      base.clone().getCount(),
      base.clone().andWhere('q.isActive = true').getCount(),
      base
        .clone()
        .select('q.examType', 'examType')
        .addSelect('COUNT(*)', 'count')
        .groupBy('q.examType')
        .getRawMany<{ examType: string; count: string }>(),
      base
        .clone()
        .select('q.subject', 'subject')
        .addSelect('COUNT(*)', 'count')
        .groupBy('q.subject')
        .getRawMany<{ subject: string; count: string }>(),
      base
        .clone()
        .select('q.difficulty', 'difficulty')
        .addSelect('COUNT(*)', 'count')
        .groupBy('q.difficulty')
        .getRawMany<{ difficulty: string; count: string }>(),
      base
        .clone()
        .select('q.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('q.type')
        .getRawMany<{ type: string; count: string }>(),
      base
        .clone()
        .select('q.year', 'year')
        .addSelect('COUNT(*)', 'count')
        .groupBy('q.year')
        .orderBy('q.year', 'DESC')
        .getRawMany<{ year: number; count: string }>(),
      base.clone().innerJoin('q.explanations', 'e').getCount(),
      base.clone().andWhere('q.questionImageUrl IS NOT NULL').getCount(),
    ]);

    const toMap = (rows: { [k: string]: any }[], key: string) =>
      Object.fromEntries(rows.map((r) => [r[key], Number(r.count)]));

    return {
      total,
      active,
      inactive: total - active,
      byExamType: toMap(byExamRaw, 'examType'),
      bySubject: toMap(bySubjectRaw, 'subject'),
      byDifficulty: toMap(byDifficultyRaw, 'difficulty'),
      byType: toMap(byTypeRaw, 'type'),
      byYear: Object.fromEntries(
        byYearRaw.map((r) => [Number(r.year), Number(r.count)]),
      ) as Record<number, number>,
      withExplanations,
      withImages,
    };
  }

  // ─── EXAM SESSION QUESTION POOL ────────────────────────────────────────────
  // Called by ExamSessions module when building a new session

  async getSessionPool(params: {
    examType?: string;
    subjects: string[];
    year?: number;
    difficulty?: string;
    type?: string;
    limit: number;
    shuffled?: boolean;
    schoolId?: string;
    classId?: string;
  }): Promise<Question[]> {
    const qb = this.questionRepository
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.options', 'options')
      .leftJoinAndSelect('q.answer', 'answer')
      .where('q.isActive = true');

    if (params.examType)
      qb.andWhere('q.examType = :examType', { examType: params.examType });
    if (params.subjects?.length)
      qb.andWhere('q.subject IN (:...subjects)', {
        subjects: params.subjects,
      });
    if (params.year) qb.andWhere('q.year = :year', { year: params.year });
    if (params.difficulty)
      qb.andWhere('q.difficulty = :difficulty', {
        difficulty: params.difficulty,
      });
    if (params.type) qb.andWhere('q.type = :type', { type: params.type });

    // ── Scope ──
    if (params.classId && params.schoolId) {
      qb.andWhere(
        '(q.schoolId = :schoolId AND q.classId = :classId) OR (q.schoolId = :schoolId AND q.classId IS NULL)',
        { schoolId: params.schoolId, classId: params.classId },
      );
    } else if (params.schoolId) {
      qb.andWhere('q.schoolId = :schoolId', { schoolId: params.schoolId });
    } else {
      qb.andWhere('q.schoolId IS NULL');
    }

    if (params.shuffled) {
      qb.orderBy('RANDOM()');
    }

    qb.take(params.limit);
    return qb.getMany();
  }

  // ─── ANSWER VERIFICATION ───────────────────────────────────────────────────
  // Called by ExamSessions when auto-scoring MCQ submissions

  async verifyAnswer(
    questionId: string,
    selectedLabel: string,
  ): Promise<boolean> {
    const answer = await this.questionAnswerRepository.findOne({
      where: { question: { id: questionId } },
    });
    if (!answer) return false;
    return answer.correctLabel === selectedLabel;
  }

  // ─── BULK IMPORT ──────────────────────────────────────────────────────────
  // Processes each row individually so partial success is possible.
  // Errors are collected and returned; the caller decides whether to retry.

  async bulkImport(dto: BulkImportDto): Promise<BulkImportResult> {
    const result: BulkImportResult = { imported: 0, failed: 0, errors: [] };

    for (let i = 0; i < dto.questions.length; i++) {
      const row = dto.questions[i];
      try {
        await this.create({ ...row, schoolId: dto.schoolId ?? null });
        result.imported++;
      } catch (err: any) {
        result.failed++;
        result.errors.push({
          row: i + 1,
          reason: err?.message ?? 'Unknown error',
        });
      }
    }

    return result;
  }

  // ─── PRIVATE HELPERS ───────────────────────────────────────────────────────

  private async findOneOrThrow(id: string): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['options', 'answer', 'explanations'],
      order: { options: { order: 'ASC' } },
    });
    if (!question) {
      throw new NotFoundException(`Question "${id}" not found.`);
    }
    return question;
  }

  private validateQuestionTypeConstraints(
    dto: Partial<CreateQuestionDto>,
  ): void {
    const mcqTypes = [
      QuestionType.MCQ,
      QuestionType.TRUE_FALSE,
      QuestionType.OBJECTIVE,
    ];
    const isMcq = dto.type && mcqTypes.includes(dto.type as QuestionType);

    if (isMcq && dto.options !== undefined && dto.options.length < 2) {
      throw new BadRequestException(
        'MCQ questions require at least 2 options.',
      );
    }

    if (isMcq && dto.options?.length && !dto.answer) {
      throw new BadRequestException('MCQ questions require an answer.');
    }
  }

  private assertPublishable(question: Question): void {
    const mcqTypes = [
      QuestionType.MCQ,
      QuestionType.TRUE_FALSE,
      QuestionType.OBJECTIVE,
    ];
    const isMcq = mcqTypes.includes(question.type);

    if (isMcq && (!question.options?.length || !question.answer)) {
      throw new BadRequestException(
        'Cannot publish MCQ question without options and an answer.',
      );
    }
  }
}
