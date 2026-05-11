// jwt-access.strategy.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ConfigType } from '@nestjs/config';
import { JwtAccessPayload } from '../interfaces/jwt-payload.interface';
import jwtConfig from '../config/jwtConfig';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConf: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConf.accessSecret,
      issuer: jwtConf.issuer,
      audience: jwtConf.audience,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtAccessPayload) {
    if (!payload.sub || !payload.jti) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: payload.sub,
      role: payload.role,
      jti: payload.jti,
    };
  }
}
