import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ConfigType } from '@nestjs/config';
import { JwtAccessPayload } from '../interfaces/jwt-payload.interface';
import jwtConfig from '../config/jwtConfig';

import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConf: ConfigType<typeof jwtConfig>,
    private readonly userService: UserService,
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
    const user = await this.userService.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account is inactive or not found');
    }

    return { ...user, jti: payload.jti };
  }
}
