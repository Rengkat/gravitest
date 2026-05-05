import { BaseTemplateContext } from './template-context.interface';

export interface AccountLockedContext extends BaseTemplateContext {
  lockedUntil: string;
}
