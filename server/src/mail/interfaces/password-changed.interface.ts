import { BaseTemplateContext } from './template-context.interface';

export interface PasswordChangedContext extends BaseTemplateContext {
  changedAt: string;
  ipAddress?: string;
  deviceName?: string;
}
