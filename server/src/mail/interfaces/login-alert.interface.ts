import { BaseTemplateContext } from './template-context.interface';

export interface LoginAlertContext extends BaseTemplateContext {
  loginTime: string;
  ipAddress?: string;
  deviceName?: string;
}
