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
import { User } from '../../user/entities/user.entity';
import { School } from 'src/schools/entities/school.entity';

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

  @OneToOne(() => User, (u) => u.schoolAdmin)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => School, (s) => s.admins)
  school: School;
}
