import {
  AuthProvider,
  Gender,
  NigerianState,
  UserRole,
} from 'src/common/enums/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  Index,
  BeforeInsert,
  BeforeUpdate,
  DeleteDateColumn,
} from 'typeorm';
import { StudentProfile } from './student-profile.entity';
import { TutorProfile } from './tutor-profile.entity';
import { SchoolAdmin } from './school-admin.entity';
import { Exclude, Expose } from 'class-transformer';
// import { Subscription } from './subscription.entity';
// import { Notification } from './notification.entity';
// import { AiChatSession } from './ai-chat-session.entity';
// import { ExamSession } from './exam-session.entity';

@Entity('users')
@Index(['email'], { unique: true, where: '"email" IS NOT NULL' })
@Index(['phoneNumber'], { unique: true, where: '"phone_number" IS NOT NULL' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  firstName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: false })
  lastName!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'email',
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 20,
    nullable: true,
    name: 'phone_number',
  })
  phoneNumber?: string | null;

  // ── Auth ───────────────────────────────────────────────────────────────
  @Column({ type: 'varchar', nullable: false, select: false })
  @Exclude()
  passwordHash!: string;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.EMAIL })
  authProvider!: AuthProvider;

  @Column({ type: 'varchar', nullable: true, select: false })
  @Exclude()
  googleId?: string | null;

  // ── OTP — email/phone verification & 2FA ──────────────────────────────
  @Column({ type: 'varchar', length: 6, nullable: true, select: false })
  @Exclude()
  otpCode: string | null;

  @Column({ type: 'timestamptz', nullable: true, select: false })
  @Exclude()
  otpExpiresAt: Date | null;

  @Column({ type: 'int', default: 0, select: false })
  @Exclude()
  otpAttempts: number;

  // ── Email verification (link-based) ───────────────────────────────────
  @Column({ type: 'varchar', nullable: true, select: false })
  @Exclude()
  verificationToken: string | null;

  @Column({ type: 'timestamptz', nullable: true, select: false })
  @Exclude()
  verificationTokenExpiresAt: Date | null;

  // ── Password reset ─────────────────────────────────────────────────────
  @Column({ type: 'varchar', nullable: true, select: false })
  @Exclude()
  passwordResetToken: string | null;

  @Column({ type: 'timestamptz', nullable: true, select: false })
  @Exclude()
  passwordResetExpiresAt: Date | null;

  // ── Two-factor auth ────────────────────────────────────────────────────
  @Column({ type: 'varchar', nullable: true, select: false })
  @Exclude()
  twoFactorSecret?: string | null;

  @Column({ type: 'boolean', default: false, select: false })
  @Exclude()
  twoFactorEnabled?: boolean;

  // ── Account locking ────────────────────────────────────────────────────
  @Column({ type: 'int', default: 0, select: false })
  @Exclude()
  failedLoginAttempts: number;

  @Column({ type: 'timestamptz', nullable: true, select: false })
  @Exclude()
  lockedUntil: Date | null;

  // ── Pending email change ───────────────────────────────────────────────
  @Column({ type: 'varchar', nullable: true, select: false })
  @Exclude()
  newEmailPending: string | null;

  // ── Role & status ──────────────────────────────────────────────────────
  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role!: UserRole;

  @Column({ type: 'boolean', default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'boolean', default: false })
  isPhoneVerified?: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  // ── Profile ────────────────────────────────────────────────────────────
  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null;

  @Column({ type: 'enum', enum: NigerianState, nullable: true })
  stateOfResidence: NigerianState | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lga: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt!: Date | null;

  // ── Timestamps ─────────────────────────────────────────────────────────
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ── Soft Delete ────────────────────────────────────────────────────────
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  deletedBy: string | null;

  @Column({ type: 'text', nullable: true })
  deletionReason: string | null;

  // ── Relations ──────────────────────────────────────────────────────────
  @OneToOne(() => StudentProfile, (p) => p.user, { nullable: true })
  studentProfile: StudentProfile | null;

  @OneToOne(() => TutorProfile, (p) => p.user, { nullable: true })
  tutorProfile: TutorProfile | null;

  @OneToOne(() => SchoolAdmin, (a) => a.user, { nullable: true })
  schoolAdmin: SchoolAdmin | null;

  // @OneToMany(() => Subscription, (s) => s.user)
  // subscriptions: Subscription[];

  // @OneToMany(() => Notification, (n) => n.user)
  // notifications: Notification[];

  // @OneToMany(() => AiChatSession, (s) => s.user)
  // aiChatSessions: AiChatSession[];

  // @OneToMany(() => ExamSession, (s) => s.user)
  // examSessions: ExamSession[];

  // @OneToMany(() => UserToken, (token) => token.user)
  // tokens: UserToken[];

  // ── Computed ───────────────────────────────────────────────────────────
  @Expose()
  get fullName(): string {
    return [this.firstName, this?.middleName, this.lastName]
      .filter(Boolean)
      .join(' ');
  }

  // ── Domain Methods ─────────────────────────────────────────────────────

  isAccountLocked(): boolean {
    return !!this.lockedUntil && new Date() < this.lockedUntil;
  }

  incrementFailedLoginAttempts(maxAttempts = 5, lockMinutes = 15): void {
    this.failedLoginAttempts += 1;

    if (this.failedLoginAttempts >= maxAttempts) {
      this.lockedUntil = new Date(Date.now() + lockMinutes * 60 * 1000);
    }
  }

  resetFailedLoginAttempts(): void {
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
  }

  scheduleOtp(code: string, expiresAt: Date): void {
    this.otpCode = code;
    this.otpExpiresAt = expiresAt;
    this.otpAttempts = 0;
  }

  clearOtp(): void {
    this.otpCode = null;
    this.otpExpiresAt = null;
    this.otpAttempts = 0;
  }

  markEmailVerified(): void {
    this.isEmailVerified = true;
    this.clearOtp();
    this.verificationToken = null;
    this.verificationTokenExpiresAt = null;
  }

  markPhoneVerified(): void {
    this.isPhoneVerified = true;
    this.clearOtp();
  }

  schedulePasswordReset(token: string, expiresAt: Date): void {
    this.passwordResetToken = token;
    this.passwordResetExpiresAt = expiresAt;
  }

  clearPasswordReset(): void {
    this.passwordResetToken = null;
    this.passwordResetExpiresAt = null;
  }

  changePassword(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
    this.clearPasswordReset();
    this.clearOtp();
    this.resetFailedLoginAttempts();
  }

  deactivate(): void {
    this.isActive = false;
    this.clearOtp();
    this.resetFailedLoginAttempts();
  }

  softDelete(by: string, reason?: string): void {
    this.deletedAt = new Date();
    this.deletedBy = by;
    this.deletionReason = reason ?? null;
    this.isActive = false;
    this.clearOtp();
    this.clearPasswordReset();
    this.resetFailedLoginAttempts();
  }

  restore(): void {
    this.deletedAt = null;
    this.deletedBy = null;
    this.deletionReason = null;
    this.isActive = true;
  }
  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase(): void {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
    if (this.newEmailPending) {
      this.newEmailPending = this.newEmailPending.toLowerCase().trim();
    }
  }
}
