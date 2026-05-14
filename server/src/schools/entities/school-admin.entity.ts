import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  // ManyToOne,
  // OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import type { User } from '../../user/entities/user.entity';
import { School } from './school.entity';

@Entity('school_admins')
export class SchoolAdmin {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ── Relations ──────────────────────────────────────────────────────────

  @OneToOne('User', (u: User) => u.schoolAdmin)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => School, (s) => s.admins)
  @JoinColumn({ name: 'school_id' })
  school!: School;
}
