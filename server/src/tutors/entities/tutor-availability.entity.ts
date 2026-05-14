import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { TutorProfile } from './tutor-profile.entity';

@Entity('tutor_availability')
@Index(['tutorId', 'dayOfWeek'])
export class TutorAvailability {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tutorId!: string;

  /** 0=Monday … 6=Sunday */
  @Column({ type: 'int' })
  dayOfWeek!: number;

  /** HH:mm 24hr format e.g. '09:00' */
  @Column({ type: 'varchar', length: 5 })
  startTime!: string;

  /** HH:mm 24hr format e.g. '17:00' */
  @Column({ type: 'varchar', length: 5 })
  endTime!: string;

  @Column({ type: 'varchar', length: 50, default: 'Africa/Lagos' })
  timezone!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => TutorProfile, (t) => t.availability, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: TutorProfile;
}
