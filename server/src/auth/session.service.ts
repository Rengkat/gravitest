import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import {
  SessionRevokeReason,
  UserSession,
} from './entities/user-session.entity';
import { TokenProvider } from './providers/token.provider';

export interface CreateSessionInput {
  userId: string;
  jti: string;
  refreshTokenHash: string;
  refreshExpiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceId?: string | null;
  deviceName?: string | null;
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
    private readonly tokenProvider: TokenProvider,
  ) {}

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────

  async create(input: CreateSessionInput): Promise<UserSession> {
    const session = this.sessionRepo.create({
      userId: input.userId,
      jti: input.jti,
      refreshTokenHash: input.refreshTokenHash,
      expiresAt: input.refreshExpiresAt,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      deviceId: input.deviceId ?? null,
      deviceName: input.deviceName ?? null,
      lastUsedAt: new Date(),
    });

    return this.sessionRepo.save(session);
  }

  // ─────────────────────────────────────────────
  // VALIDATE + ROTATE  (refresh flow)
  // ─────────────────────────────────────────────

  /**
   * Validates the incoming refresh token, revokes the old session,
   * and returns the session so AuthService can issue a new token bundle.
   *
   * Throws UnauthorizedException on any anomaly — the caller should
   * NOT expose the specific reason to the client (token theft vector).
   */
  async validateAndConsume(
    jti: string,
    rawRefreshToken: string,
  ): Promise<UserSession> {
    const session = await this.sessionRepo
      .createQueryBuilder('s')
      .addSelect('s.refreshTokenHash')
      .where('s.jti = :jti', { jti })
      .getOne();

    if (!session) {
      this.logger.warn(`Refresh attempted with unknown JTI: ${jti}`);
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!session.isActive()) {
      // If already revoked this might be a stolen token replayed.
      // Revoke ALL sessions for this user as a precaution.
      if (session.isRevoked()) {
        this.logger.warn(
          `SECURITY: Revoked refresh token reused for user ${session.userId}. Revoking all sessions.`,
        );
        await this.revokeAll(
          session.userId,
          SessionRevokeReason.SECURITY_REVOKED,
        );
      }
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isTokenValid = this.tokenProvider.refreshTokenMatches(
      rawRefreshToken,
      session.refreshTokenHash,
    );

    if (!isTokenValid) {
      this.logger.warn(
        `SECURITY: Refresh token hash mismatch for JTI ${jti}. Possible token swap.`,
      );
      // Revoke this session as it may be compromised
      await this.revoke(session, SessionRevokeReason.SECURITY_REVOKED);
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Consume (revoke) the old session — rotation means one-use-per-token
    await this.revoke(session, SessionRevokeReason.REFRESH_ROTATED);

    return session;
  }

  // ─────────────────────────────────────────────
  // REVOKE
  // ─────────────────────────────────────────────

  async revokeByJti(jti: string, reason: SessionRevokeReason): Promise<void> {
    const session = await this.sessionRepo.findOne({ where: { jti } });
    if (session) {
      await this.revoke(session, reason);
    }
  }

  async revokeAll(userId: string, reason: SessionRevokeReason): Promise<void> {
    await this.sessionRepo
      .createQueryBuilder()
      .update(UserSession)
      .set({ revokedAt: new Date(), revokedReason: reason })
      .where('"userId" = :userId', { userId })
      .andWhere('"revokedAt" IS NULL')
      .execute();

    this.logger.log(
      `All sessions revoked for user ${userId} — reason: ${reason}`,
    );
  }

  // ─────────────────────────────────────────────
  // MAINTENANCE
  // ─────────────────────────────────────────────

  /**
   * Prune expired sessions. Wire this to a cron job:
   *   @Cron('0 3 * * *') — runs at 03:00 every day
   */
  async pruneExpired(): Promise<void> {
    const result = await this.sessionRepo.delete({
      expiresAt: LessThan(new Date()),
    });
    this.logger.log(`Pruned ${result.affected ?? 0} expired sessions`);
  }

  // ─────────────────────────────────────────────
  // PRIVATE
  // ─────────────────────────────────────────────

  private async revoke(
    session: UserSession,
    reason: SessionRevokeReason,
  ): Promise<void> {
    session.revoke(reason);
    await this.sessionRepo.save(session);
  }
}
