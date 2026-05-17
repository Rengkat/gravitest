import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { HashProvider } from 'src/common/hash/providers/Hash.provider';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterUserDto } from 'src/auth/dto/auth.dto';
import { AuthProvider, UserRole } from 'src/common/enums/enums';

@Injectable()
export class UserRegistrationProvider {
  private readonly logger = new Logger(UserRegistrationProvider.name);

  constructor(
    private readonly hashProvider: HashProvider,
    private readonly dataSource: DataSource,
  ) {}

  async registerUser(dto: RegisterUserDto): Promise<User> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedPhone = dto.phoneNumber
      ? this.normalizePhone(dto.phoneNumber)
      : null;

    // ── Uniqueness check BEFORE opening the transaction ──────────────────
    // Cheaper to fail fast here than inside a transaction
    await this.assertUniqueEmailAndPhone(normalizedEmail, normalizedPhone);

    const passwordHash = await this.hashProvider.hashPassword(dto.password);

    return this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, {
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        middleName: dto.middleName?.trim() ?? null,
        email: normalizedEmail,
        phoneNumber: normalizedPhone,
        passwordHash,
        role: UserRole.STUDENT,
        authProvider: AuthProvider.EMAIL,
        isActive: true,
        isEmailVerified: false,
        isPhoneVerified: false,
      });

      await manager.save(User, user);

      // ... rest of your entities (UserSettings, StudentProfile, etc.)

      return user;
    });
  }

  // ── Uniqueness Helpers ───────────────────────────────────────────────────

  /**
   * Single query checks both email and phone at once.
   * Called before the transaction opens — no point holding
   * a transaction open while we do read queries.
   */
  private async assertUniqueEmailAndPhone(
    email: string,
    phone: string | null,
    excludeId?: string,
  ): Promise<void> {
    const repo = this.dataSource.getRepository(User);

    // ── Email ─────────────────────────────────────────────────
    const emailQb = repo
      .createQueryBuilder('u')
      .where('LOWER(u.email) = :email', { email })
      .andWhere('u.deletedAt IS NULL');

    if (excludeId) emailQb.andWhere('u.id != :excludeId', { excludeId });

    const emailExists = await emailQb.getExists();
    if (emailExists) {
      throw new ConflictException('An account with this email already exists');
    }

    // ── Phone (only if provided) ──────────────────────────────
    if (!phone) return;

    const phoneQb = repo
      .createQueryBuilder('u')
      .where('u.phoneNumber = :phone', { phone })
      .andWhere('u.deletedAt IS NULL');

    if (excludeId) phoneQb.andWhere('u.id != :excludeId', { excludeId });

    const phoneExists = await phoneQb.getExists();
    if (phoneExists) {
      throw new ConflictException(
        'An account with this phone number already exists',
      );
    }
  }

  private normalizePhone(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = '234' + cleaned.substring(1);
    }
    return cleaned;
  }
}
