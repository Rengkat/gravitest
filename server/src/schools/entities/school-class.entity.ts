import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { School } from './school.entity';

@Entity('school_classes')
@Index(['schoolId', 'name'], { unique: true })
@Index(['classCode'], { unique: true })
export class SchoolClass {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  schoolId!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string; // e.g. 'SS2A', 'JSS3B', 'Form 4'

  @Column({ type: 'varchar', length: 50, nullable: true })
  arm: string | null; // e.g. 'A', 'B', 'Science'

  @Column({ type: 'int', nullable: true })
  year: number | null; // Academic year e.g. 2025

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string | null; // Optional note about the class

  // ── Class Credentials ──────────────────────────────────────
  // School admin shares these with whichever teacher they choose.
  // No teacher account needed — just classCode + PIN to access.

  /** Auto-generated. e.g. 'KCL-SS2A-2025'. Given to teacher by admin. */
  @Column({ type: 'varchar', length: 30, unique: true })
  classCode!: string;

  /** Hashed 4–6 digit PIN. Never returned in API responses. */
  @Column({ type: 'varchar', select: false })
  pinHash!: string;

  @Column({ type: 'timestamptz', nullable: true })
  pinLastChangedAt: Date | null;

  // ── Exam Config Defaults for this class ────────────────────
  // Teacher can override per-exam but these are the class defaults.

  /** Default duration for exams created under this class (minutes) */
  @Column({ type: 'int', default: 60 })
  defaultExamDurationMinutes!: number;

  /** Default number of questions per exam */
  @Column({ type: 'int', default: 40 })
  defaultQuestionCount!: number;

  // ── Stats ──────────────────────────────────────────────────
  @Column({ type: 'int', default: 0 })
  totalStudents!: number;

  @Column({ type: 'int', default: 0 })
  totalExamsCreated!: number;

  // ── Status ─────────────────────────────────────────────────
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  // ── Timestamps ─────────────────────────────────────────────
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @ManyToOne(() => School, (s) => s.classes)
  @JoinColumn({ name: 'school_id' })
  school!: School;

  // ── Domain Methods ─────────────────────────────────────────
  rotatePin(newPinHash: string): void {
    this.pinHash = newPinHash;
    this.pinLastChangedAt = new Date();
  }
}
