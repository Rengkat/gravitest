import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { LibraryContent } from './entities/library-contnent.entity';
import { LibraryAccess } from './entities/library-content-access.entity';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { QueryLibraryDto } from './dto/query-library.dto';
import { RecordAccessDto } from './dto/record-access.dto';
import { AddBookmarkDto } from './dto/add-bookmark.dto';
import { SubscriptionTier } from 'src/common/enums/enums';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginatedResult } from 'src/common/pagination/pagination.interface';

// ─── Types ────────────────────────────────────────────────────
interface AccessCheckResult {
  hasAccess: boolean;
  reason?: 'free' | 'owned' | 'subscription' | 'no_access' | 'expired';
  accessRecord?: LibraryAccess;
}

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(LibraryContent)
    private readonly contentRepo: Repository<LibraryContent>,

    @InjectRepository(LibraryAccess)
    private readonly accessRepo: Repository<LibraryAccess>,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  // ─── ADMIN: CREATE ────────────────────────────────────────
  async create(dto: CreateLibraryDto): Promise<LibraryContent> {
    // Exactly one access model must be set
    const accessOptions = [
      dto.isFree,
      dto.requiredTier,
      dto.priceKobo != null,
    ].filter(Boolean);

    if (accessOptions.length > 1) {
      throw new BadRequestException(
        'Specify only one of: isFree, requiredTier, or priceKobo',
      );
    }

    const content = this.contentRepo.create({
      ...dto,
      isFree: dto.isFree ?? false,
      examTypes: dto.examTypes ?? [],
      classLevels: dto.classLevels ?? [],
      isActive: true,
      isPublished: false, // requires explicit publish step
    });

    return this.contentRepo.save(content);
  }

  // ─── PUBLIC: LIST ─────────────────────────────────────────
  async findAll(
    query: QueryLibraryDto,
    userTier?: SubscriptionTier,
  ): Promise<PaginatedResult<LibraryContent>> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      contentType,
      subject,
      examType,
      classLevel,
      isFree,
      isPublished = true,
      isActive = true,
    } = query;

    const where: FindOptionsWhere<LibraryContent> = { isActive, isPublished };

    if (contentType) where.contentType = contentType;
    if (subject) where.subject = subject;
    if (isFree != null) where.isFree = isFree;

    const qb = this.contentRepo.createQueryBuilder('c').where(where);

    // Array column filters
    if (examType) qb.andWhere(':examType = ANY(c.examTypes)', { examType });
    if (classLevel)
      qb.andWhere(':classLevel = ANY(c.classLevels)', { classLevel });

    // Full-text search on title, description and topic
    if (search) {
      qb.andWhere(
        '(c.title ILIKE :q OR c.description ILIKE :q OR c.topic ILIKE :q)',
        { q: `%${search}%` },
      );
    }

    qb.orderBy(`c.${sortBy}`, sortOrder);

    // ── Delegate pagination entirely to PaginationProvider ──
    return this.paginationProvider.paginateQueryBuilder(qb, { page, limit });
  }

  // ─── ADMIN: LIST ALL (incl. drafts & inactive) ────────────
  async findAllAdmin(
    query: QueryLibraryDto,
  ): Promise<PaginatedResult<LibraryContent>> {
    // Strip public-only defaults so admins see everything
    return this.findAll({
      ...query,
      isPublished: undefined,
      isActive: undefined,
    });
  }

  // ─── SINGLE CONTENT ───────────────────────────────────────
  async findOne(id: string): Promise<LibraryContent> {
    const content = await this.contentRepo.findOne({ where: { id } });
    if (!content)
      throw new NotFoundException(`Library content ${id} not found`);
    return content;
  }

  // ─── CHECK ACCESS ─────────────────────────────────────────
  /**
   * Priority chain:
   *  1. Content is free  → always allowed
   *  2. Active LibraryAccess record (purchased or gifted) → allowed / expired
   *  3. User's subscription tier meets requiredTier → allowed via subscription
   *  4. Everything else → no_access
   */
  async checkAccess(
    contentId: string,
    userId: string,
    userTier?: SubscriptionTier,
  ): Promise<AccessCheckResult> {
    const content = await this.findOne(contentId);

    if (content.isFree) return { hasAccess: true, reason: 'free' };

    const accessRecord = await this.accessRepo.findOne({
      where: { userId, contentId },
    });

    if (accessRecord) {
      if (accessRecord.isExpired())
        return { hasAccess: false, reason: 'expired' };
      return { hasAccess: true, reason: 'owned', accessRecord };
    }

    if (content.requiredTier && userTier) {
      const TIER_RANK: Record<SubscriptionTier, number> = {
        [SubscriptionTier.FREE]: 0,
        [SubscriptionTier.BASIC]: 1,
        [SubscriptionTier.STANDARD]: 2,
        [SubscriptionTier.PREMIUM]: 3,
        [SubscriptionTier.ENTERPRISE]: 4,
      };
      if (TIER_RANK[userTier] >= TIER_RANK[content.requiredTier]) {
        return { hasAccess: true, reason: 'subscription' };
      }
    }

    return { hasAccess: false, reason: 'no_access' };
  }

  // ─── GRANT ACCESS (called by Payments module) ─────────────
  async grantAccess(
    userId: string,
    contentId: string,
    paymentId?: string,
    expiresAt?: Date,
  ): Promise<LibraryAccess> {
    const content = await this.findOne(contentId);

    const existing = await this.accessRepo.findOne({
      where: { userId, contentId },
    });

    if (existing) {
      // Re-purchase: refresh expiry and payment reference
      existing.expiresAt = expiresAt ?? null;
      existing.paymentId = paymentId ?? null;
      return this.accessRepo.save(existing);
    }

    const access = this.accessRepo.create({
      userId,
      contentId,
      contentType: content.contentType,
      paymentId: paymentId ?? null,
      expiresAt: expiresAt ?? null,
    });

    await this.contentRepo.increment({ id: contentId }, 'totalDownloads', 1);

    return this.accessRepo.save(access);
  }

  // ─── RECORD VIEW / PROGRESS ───────────────────────────────
  async recordAccess(
    userId: string,
    dto: RecordAccessDto,
  ): Promise<LibraryAccess> {
    const { contentId, progressPercent } = dto;

    const access = await this.accessRepo.findOne({
      where: { userId, contentId },
    });
    if (!access)
      throw new ForbiddenException('Access not granted for this content');

    access.recordAccess();
    if (progressPercent != null) access.updateProgress(progressPercent);

    await this.contentRepo.increment({ id: contentId }, 'totalViews', 1);

    return this.accessRepo.save(access);
  }

  // ─── BOOKMARKS ────────────────────────────────────────────
  async addBookmark(
    userId: string,
    contentId: string,
    dto: AddBookmarkDto,
  ): Promise<LibraryAccess> {
    const access = await this.accessRepo.findOne({
      where: { userId, contentId },
    });
    if (!access)
      throw new ForbiddenException('Access not granted for this content');

    const bookmarks = access.bookmarks ?? [];
    bookmarks.push({ ...dto, createdAt: new Date().toISOString() });
    access.bookmarks = bookmarks;

    return this.accessRepo.save(access);
  }

  async removeBookmark(
    userId: string,
    contentId: string,
    position: number,
  ): Promise<LibraryAccess> {
    const access = await this.accessRepo.findOne({
      where: { userId, contentId },
    });
    if (!access)
      throw new ForbiddenException('Access not granted for this content');

    access.bookmarks = (access.bookmarks ?? []).filter(
      (b) => b.position !== position,
    );
    return this.accessRepo.save(access);
  }

  // ─── USER LIBRARY ─────────────────────────────────────────
  async getUserLibrary(userId: string): Promise<LibraryAccess[]> {
    return this.accessRepo.find({
      where: { userId },
      relations: ['content'],
      order: { lastAccessedAt: 'DESC' },
    });
  }

  async getUserAccessRecord(
    userId: string,
    contentId: string,
  ): Promise<LibraryAccess | null> {
    return this.accessRepo.findOne({
      where: { userId, contentId },
      relations: ['content'],
    });
  }

  // ─── ADMIN: UPDATE ────────────────────────────────────────
  async update(id: string, dto: UpdateLibraryDto): Promise<LibraryContent> {
    const content = await this.findOne(id);
    Object.assign(content, dto);
    return this.contentRepo.save(content);
  }

  // ─── ADMIN: PUBLISH / UNPUBLISH ───────────────────────────
  async publish(id: string): Promise<LibraryContent> {
    const content = await this.findOne(id);
    content.isPublished = true;
    return this.contentRepo.save(content);
  }

  async unpublish(id: string): Promise<LibraryContent> {
    const content = await this.findOne(id);
    content.isPublished = false;
    return this.contentRepo.save(content);
  }

  // ─── ADMIN: SOFT DELETE ───────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const content = await this.findOne(id);
    content.isActive = false;
    await this.contentRepo.save(content);
    return { message: `Content ${id} deactivated` };
  }

  // ─── ADMIN: STATS ─────────────────────────────────────────
  async getStats() {
    const [total, published, free, paid] = await Promise.all([
      this.contentRepo.count(),
      this.contentRepo.count({ where: { isPublished: true } }),
      this.contentRepo.count({ where: { isFree: true } }),
      this.contentRepo.count({ where: { isFree: false } }),
    ]);

    const [topViewed, topDownloaded] = await Promise.all([
      this.contentRepo.find({
        where: { isPublished: true },
        order: { totalViews: 'DESC' },
        take: 5,
      }),
      this.contentRepo.find({
        where: { isPublished: true },
        order: { totalDownloads: 'DESC' },
        take: 5,
      }),
    ]);

    return { total, published, free, paid, topViewed, topDownloaded };
  }
}
