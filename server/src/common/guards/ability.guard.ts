import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../../ability/ability.factory/ability.factory';
import {
  CHECK_ABILITY_KEY,
  RequiredRule,
} from '../decorators/check-ability.decorator';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rules = this.reflector.get<RequiredRule[]>(
      CHECK_ABILITY_KEY,
      context.getHandler(),
    );

    // If no rules defined, allow access (public route)
    if (!rules || rules.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const ability = this.abilityFactory.defineAbility(user);

    // Check if user has all required permissions
    const hasPermission = rules.every((rule) =>
      ability.can(rule.action, rule.subject),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
