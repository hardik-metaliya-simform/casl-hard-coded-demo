import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserContext } from '../../ability/ability.factory/ability.factory';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  async validate(payload: any): Promise<UserContext> {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: payload.sub,
      role: payload.role,
      departmentId: payload.departmentId,
      managedDepartmentIds: payload.managedDepartmentIds,
    };
  }
}
