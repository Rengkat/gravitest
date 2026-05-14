import { PayoutStatus } from 'src/common/enums/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TutorProfile } from './tutor-profile.entity';

@Entity('payouts')
@Index(['tutorId', 'status'])
@Index(['createdAt'])
export class TutorPayout {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tutorId!: string;

  @Column({ type: 'enum', enum: PayoutStatus, default: PayoutStatus.PENDING })
  status!: PayoutStatus;

  /** Amount requested in kobo */
  @Column({ type: 'int' })
  amountKobo!: number;

  /** Paystack transfer reference */
  @Column({ type: 'varchar', nullable: true, unique: true })
  transferReference: string | null;

  @Column({ type: 'varchar', nullable: true })
  paystackTransferCode: string | null;

  /** Bank details snapshot at time of payout */
  @Column({ type: 'jsonb' })
  bankSnapshot!: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };

  @Column({ type: 'text', nullable: true })
  failureReason: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  processedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  processedBy: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => TutorProfile, (t) => t.payouts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: TutorProfile;

  get amountNaira(): number {
    return this.amountKobo / 100;
  }

  markProcessed(reference: string, processedBy?: string): void {
    this.status = PayoutStatus.COMPLETED;
    this.transferReference = reference;
    this.processedAt = new Date();
    this.processedBy = processedBy ?? null;
  }

  markFailed(reason: string): void {
    this.status = PayoutStatus.FAILED;
    this.failureReason = reason;
  }
}
