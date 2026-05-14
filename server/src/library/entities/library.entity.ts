import {
  ClassLevel,
  ContentType,
  ExamType,
  Subject,
  SubscriptionTier,
} from 'src/common/enums/enums';
import { LibraryAccess } from 'src/library/entities/library-content-access.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('library_contents')
@Index(['contentType'])
@Index(['subject'])
export class LibraryContent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: ContentType })
  contentType!: ContentType; // VIDEO, EBOOK, DOCUMENT etc

  @Column({ type: 'enum', enum: Subject, nullable: true })
  subject: Subject | null;

  @Column({ type: 'varchar', nullable: true })
  topic: string | null;

  @Column({ type: 'varchar' })
  fileUrl!: string; // S3/Cloudinary URL

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string | null;

  @Column({ type: 'int', nullable: true })
  durationSeconds: number | null; // For videos

  @Column({ type: 'int', nullable: true })
  totalPages: number | null; // For ebooks/documents

  @Column({ type: 'bigint', nullable: true })
  fileSizeBytes: number | null;

  @Column({ type: 'enum', enum: ExamType, array: true, default: '{}' })
  examTypes: ExamType[]; // Which exams this content covers

  @Column({ type: 'enum', enum: ClassLevel, array: true, default: '{}' })
  classLevels: ClassLevel[]; // Which class levels

  // ── Access Control ─────────────────────────────────────────
  @Column({ type: 'boolean', default: false })
  isFree!: boolean; // Free for all users

  @Column({ type: 'enum', enum: SubscriptionTier, nullable: true })
  requiredTier: SubscriptionTier | null; // Minimum tier to access

  @Column({ type: 'int', nullable: true })
  priceKobo: number | null; // One-time purchase price

  // ── Stats ──────────────────────────────────────────────────
  @Column({ type: 'int', default: 0 })
  totalViews!: number;

  @Column({ type: 'int', default: 0 })
  totalDownloads!: number;

  @Column({ type: 'float', default: 0 })
  averageRating!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;

  // ── Timestamps ─────────────────────────────────────────────
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @OneToMany(() => LibraryAccess, (a) => a.content)
  accesses: LibraryAccess[];
}
