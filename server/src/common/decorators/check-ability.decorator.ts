import { SetMetadata } from '@nestjs/common';
import {
  Actions,
  AppSubjects,
} from '../../ability/ability.factory/ability.factory';

export interface RequiredRule {
  action: Actions;
  subject: AppSubjects;
}

export const CHECK_ABILITY_KEY = 'check_ability';

export const CheckAbility = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY_KEY, requirements);
