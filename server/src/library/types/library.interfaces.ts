import { LibraryAccess } from '../entities/library-content-access.entity';

export interface AccessCheckResult {
  hasAccess: boolean;
  reason?: 'free' | 'owned' | 'subscription' | 'no_access' | 'expired';
  accessRecord?: LibraryAccess;
}
