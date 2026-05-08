import { UserRole } from 'src/common/enums/enums';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  provider: string;
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload extends JwtPayload {
  refreshTokenId: string;
}
