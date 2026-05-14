import {
  OneToMany,
  Index,
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SchoolClass } from './school-class.entity';
import { NigerianState, SchoolType } from 'src/common/enums/enums';
import { SchoolAdmin } from './school-admin.entity';

@Entity('schools')
@Index(['subdomain'], { unique: true })
export class School {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  subdomain!: string; // e.g. 'kings-college-lagos'

  @Column({ type: 'enum', enum: SchoolType, default: SchoolType.SECONDARY })
  type!: SchoolType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoUrl: string | null;

  @Column({ type: 'varchar', length: 7, nullable: true })
  brandColor: string | null; // HEX color for school portal branding

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lga: string | null;

  @Column({ type: 'enum', enum: NigerianState, nullable: true })
  state: NigerianState | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'int', default: 0 })
  maxStudents!: number; // Seat limit based on school subscription

  @Column({ type: 'int', default: 0 })
  totalStudents!: number; // Cached count

  // ── Timestamps ─────────────────────────────────────────────
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @OneToMany(() => SchoolAdmin, (a: SchoolAdmin) => a.school)
  admins: SchoolAdmin[];

  @OneToMany(() => SchoolClass, (c: SchoolClass) => c.school)
  classes: SchoolClass[];
}
