import { BaseTemplateContext } from './template-context.interface';

export interface WelcomeContext extends BaseTemplateContext {
  loginUrl: string;
}
