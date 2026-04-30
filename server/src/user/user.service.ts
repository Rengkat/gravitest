import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import {
  BulkCreateUsersDto,
  BulkCreateUsersResponseDto,
  CreateUserDto,
} from './dto/create-user.dto';
import {
  AdminResetPasswordDto,
  AdminUpdateUserDto,
  ChangePasswordDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { IsNull, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashProvider } from 'src/auth/providers/Hash.provider';
import { BulkCreateUsersProvider } from './providers/BulkCreateUsersProvider';
import {
  AuthProvider,
  DeactivationType,
  UserRole,
} from 'src/common/enums/enums';
import {
  CreateUserResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserFilterDto } from './dto';
import { PaginatedResult } from 'src/common/pagination/pagination.interface';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly hashProvider: HashProvider,

    private readonly bulkCreateUserProvider: BulkCreateUsersProvider,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  // FIND HELPERS — used internally + by AuthService
  // ══════════════════════════════════════════

  //  Default: does NOT select sensitive columns (passwordHash etc).
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findActiveById(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user.isActive) {
      throw new BadRequestException('User account is inactive');
    }

    return user;
  }
  /**
   * Find user by email for auth purposes.
   * Selects passwordHash (excluded by default in other queries).
   * Returns null instead of throwing — caller decides how to handle.
   */
  async findByEmailForAuth(email: string): Promise<User | null> {
    return this.securityUserQuery()
      .where('LOWER(user.email) = LOWER(:email)', {
        email: this.normalizeEmail(email),
      })
      .andWhere('user.deletedAt IS NULL')
      .andWhere('user.isActive = true')
      .getOne();
  }

  /**
   * Find by phone — for phone OTP login.
   */
  async findByPhoneForOtp(phone: string): Promise<User | null> {
    return this.securityUserQuery()
      .where('user.phoneNumber = :phone', {
        phone: this.normalizePhone(phone),
      })
      .andWhere('user.deletedAt IS NULL')
      .andWhere('user.isActive = true')
      .getOne();
  }
  /**
   * Find by password reset token — for reset-password flow.
   */
  async findByResetToken(token: string): Promise<User | null> {
    return this.securityUserQuery()
      .where('user.passwordResetToken = :token', { token })
      .andWhere('user.deletedAt IS NULL')
      .andWhere('user.isActive = true')
      .getOne();
  }

  // PROFILE — any authenticated user
  // ══════════════════════════════════════════
  async getProfile(id: string): Promise<User> {
    return this.findActiveById(id);
  }

  async updateProfile(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Map DTO field names to entity field names where they differ
    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    if (dto.middleName !== undefined) user.middleName = dto.middleName ?? null;
    if (dto.phoneNumber !== undefined)
      user.phoneNumber = dto.phoneNumber
        ? this.normalizePhone(dto.phoneNumber)
        : null;
    if (dto.avatar !== undefined) user.avatarUrl = dto.avatar ?? null;
    if (dto.dateOfBirth !== undefined)
      user.dateOfBirth = dto.dateOfBirth ?? null;
    if (dto.stateOfResidence !== undefined)
      user.stateOfResidence = dto.stateOfResidence ?? null;
    if (dto.lga !== undefined) user.lga = dto.lga ?? null;

    return this.userRepository.save(user);
  }

  async changePassword(
    id: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect([
        'user.passwordHash',
        'user.passwordResetToken',
        'user.passwordResetExpiresAt',
        'user.otpCode',
        'user.otpExpiresAt',
        'user.otpAttempts',
        'user.refreshToken',
        'user.failedLoginAttempts',
        'user.lockedUntil',
      ])
      .where('user.id = :id', { id })
      .andWhere('user.deletedAt IS NULL')
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.passwordHash) {
      throw new BadRequestException(
        'This account uses social login. Use forgot password to create a password.',
      );
    }

    const isCorrect = await this.hashProvider.comparePassword(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isCorrect) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const newPasswordHash = await this.hashProvider.hashPassword(
      dto.newPassword,
    );
    //call the change password method
    user.changePassword(newPasswordHash);
    await this.userRepository.save(user);
    this.logger.warn(
      `SECURITY: Password changed for user ${user.id}. Sessions revoked.`,
    );

    // Optional: emit event to NotificationsService
    // await this.eventEmitter.emitAsync('user.password.changed', {
    //   userId: user.id,
    //   email: user.email,
    // });

    return {
      message:
        'Password changed successfully. Please log in again on all devices.',
    };
  }

  //DEACTIVATE
  async deactivate(
    id: string,
    type: DeactivationType,
    by?: string,
    reason?: string,
  ): Promise<{ message: string }> {
    const user = await this.findById(id);

    if (!user.isActive) {
      throw new ConflictException('Account is already deactivated');
    }

    user.deactivate(type, by, reason);

    await this.userRepository.save(user);

    this.logger.log(
      `User deactivated: ${id} | type: ${type} | by: ${by ?? 'system'} | reason: ${reason ?? 'N/A'}`,
    );

    return { message: 'Account deactivated successfully' };
  }
  // ADMIN — super admin operations
  // ══════════════════════════════════════════
  async adminCreateUser(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const normalizedPhone = dto.phoneNumber
      ? this.normalizePhone(dto.phoneNumber)
      : null;

    // ── 1. Pre-check email uniqueness ──────────────────────────────────────
    const existingEmail = await this.userRepository
      .createQueryBuilder('u')
      .where('LOWER(u.email) = LOWER(:email)', { email: normalizedEmail })
      .getOne();

    if (existingEmail) {
      throw new ConflictException(
        `An account with email ${normalizedEmail} already exists`,
      );
    }

    // ── 2. Pre-check phone uniqueness ──────────────────────────────────────
    if (normalizedPhone) {
      const existingPhone = await this.userRepository
        .createQueryBuilder('u')
        .where('u.phoneNumber = :phone', { phone: normalizedPhone })
        .getOne();

      if (existingPhone) {
        throw new ConflictException(
          `An account with phone number ${normalizedPhone} already exists`,
        );
      }
    }

    // ── 3. Password preparation ────────────────────────────────────────────
    const wasGenerated = !dto.password;
    const rawPassword = dto.password ?? this.generateTempPassword();
    const passwordHash = await this.hashProvider.hashPassword(rawPassword);

    // ── 4. Build user entity ───────────────────────────────────────────────
    const user = this.userRepository.create({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      middleName: dto.middleName?.trim() ?? null,

      email: normalizedEmail,
      phoneNumber: normalizedPhone,

      avatarUrl: dto.avatar ?? null,
      dateOfBirth: dto.dateOfBirth ?? null,
      gender: dto.gender ?? null,
      stateOfResidence: dto.stateOfResidence ?? null,
      lga: dto.lga?.trim() ?? null,

      passwordHash,
      role: dto.role ?? UserRole.STUDENT,
      authProvider: AuthProvider.EMAIL,

      isEmailVerified: dto.skipEmailVerification === true,
      isActive: true,

      // optional future field:
      // mustChangePassword: wasGenerated,
    });

    try {
      const saved = await this.userRepository.save(user);

      this.logger.warn(
        `ADMIN ACTION: User ${saved.id} created (${saved.email}) role=${saved.role}` +
          (wasGenerated ? ' temp_password_generated=true' : ''),
      );

      const userDto = plainToInstance(UserResponseDto, saved, {
        excludeExtraneousValues: true,
      });

      return {
        user: userDto,
        ...(wasGenerated && { temporaryPassword: rawPassword }),
      };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException(
          'User could not be created because email or phone already exists',
        );
      }
      throw error;
    }
  }
  // create bulk by admin
  async bulkCreateUsers(
    dto: BulkCreateUsersDto,
  ): Promise<BulkCreateUsersResponseDto> {
    return this.bulkCreateUserProvider.execute(dto);
  }

  async adminUpdateUser(id: string, dto: AdminUpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    const normalizedPhone = dto.phoneNumber
      ? this.normalizePhone(dto.phoneNumber)
      : null;

    // Profile fields
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.middleName !== undefined) user.middleName = dto.middleName ?? null;
    if (dto.phoneNumber !== undefined) user.phoneNumber = normalizedPhone;
    if (dto.avatar !== undefined) user.avatarUrl = dto.avatar ?? null;
    if (dto.dateOfBirth !== undefined)
      user.dateOfBirth = dto.dateOfBirth ?? null;
    if (dto.gender !== undefined) user.gender = dto.gender ?? null;
    if (dto.stateOfResidence !== undefined)
      user.stateOfResidence = dto.stateOfResidence ?? null;
    if (dto.lga !== undefined) user.lga = dto.lga ?? null;

    // Admin-only fields
    if (dto.email !== undefined) user.email = dto.email.toLowerCase().trim();
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.isEmailVerified !== undefined)
      user.isEmailVerified = dto.isEmailVerified;
    if (dto.isPhoneVerified !== undefined)
      user.isPhoneVerified = dto.isPhoneVerified;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    const saved = await this.userRepository.save(user);
    this.logger.log(`Admin updated user ${id}`);
    return saved;
  }

  async adminResetPassword(
    id: string,
    dto: AdminResetPasswordDto,
  ): Promise<{ message: string; tempPassword?: string }> {
    const user = await this.findById(id);

    const rawPassword = dto.newPassword ?? this.generateTempPassword();
    const newPasswordHash = await this.hashProvider.hashPassword(rawPassword);

    // Force user to change on next login
    user.changePassword(newPasswordHash);

    await this.userRepository.save(user);
    this.logger.log(`Admin reset password for user ${id}`);

    if (dto.notifyUser !== false) {
      // NotificationsService handles the email — injected via event or direct call at controller level
      return {
        message: `Password reset. Notification queued for ${user.email}.`,
      };
    }

    // Return temp password only when notifyUser is false (admin sees it)
    return {
      message: 'Password reset successfully.',
      tempPassword: rawPassword,
    };
  }

  async findAll(query: UserFilterDto): Promise<PaginatedResult<User>> {
    const {
      role,
      subscriptionTier,
      state,
      gender,
      isActive,
      emailVerified,
      search,
      createdFrom,
      createdTo,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL');

    // ── Filters ────────────────────────────────────────────────────────────
    if (role) qb.andWhere('user.role = :role', { role });

    if (subscriptionTier)
      qb.andWhere('user.subscriptionTier = :subscriptionTier', {
        subscriptionTier,
      });

    if (state) qb.andWhere('user.stateOfResidence = :state', { state });

    if (gender) qb.andWhere('user.gender = :gender', { gender });

    if (isActive !== undefined)
      qb.andWhere('user.isActive = :isActive', { isActive });

    if (emailVerified !== undefined)
      qb.andWhere('user.isEmailVerified = :emailVerified', { emailVerified });
    if (search) {
      qb.andWhere(
        `(
          user.firstName ILIKE :s OR
          user.lastName  ILIKE :s OR
          user.email     ILIKE :s OR
          user.phoneNumber ILIKE :s  
        )`,
        { s: `%${search}%` },
      );
    }

    if (createdFrom)
      qb.andWhere('user.createdAt >= :createdFrom', {
        createdFrom: new Date(createdFrom),
      });

    if (createdTo)
      qb.andWhere('user.createdAt <= :createdTo', {
        createdTo: new Date(createdTo),
      });

    // ── Sort ───────────────────────────────────────────────────────────────
    const sortableFields: Record<string, string> = {
      createdAt: 'user.createdAt',
      firstName: 'user.firstName',
      lastName: 'user.lastName',
      email: 'user.email',
    };

    const orderField = sortableFields[sortBy] ?? 'user.createdAt';
    qb.orderBy(orderField, sortOrder);

    // ── Paginate ───────────────────────────────────────────────────────────
    return this.paginationProvider.paginateQueryBuilder(qb, {
      page: query.page,
      limit: query.limit,
    });
  }
  private generateTempPassword(): string {
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
    const random = Array.from(
      { length: 6 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
    return `Gravitest@${year}${random}`;
  }
  private normalizePhone(phone: string): string {
    if (!phone) return '';
    // Example: Standardizing Nigerian numbers to 234 format
    let cleaned = phone.replace(/\D/g, ''); // Remove all non-digits
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = '234' + cleaned.substring(1);
    }
    return cleaned;
  }
  private async assertUniqueEmail(
    email: string,
    excludeId?: string,
  ): Promise<void> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .where('LOWER(u.email) = LOWER(:email)', { email });

    if (excludeId) qb.andWhere('u.id != :id', { id: excludeId });

    const existing = await qb.getOne();

    if (existing) {
      throw new ConflictException(`Email ${email} is already in use`);
    }
  }

  private async assertUniquePhone(
    phone: string,
    excludeId?: string,
  ): Promise<void> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .where('u.phoneNumber = :phone', { phone });

    if (excludeId) qb.andWhere('u.id != :id', { id: excludeId });

    const existing = await qb.getOne();

    if (existing) {
      throw new ConflictException(`Phone number ${phone} is already in use`);
    }
  }

  private toUserDto(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  private normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }
  private securityUserQuery() {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect([
        'user.passwordHash',
        'user.otpCode',
        'user.otpExpiresAt',
        'user.otpAttempts',
        'user.passwordResetToken',
        'user.passwordResetExpiresAt',
        'user.verificationToken',
        'user.verificationTokenExpiresAt',
        'user.twoFactorSecret',
        'user.twoFactorEnabled',
        'user.failedLoginAttempts',
        'user.lockedUntil',
        'user.newEmailPending',
      ]);
  }
}
