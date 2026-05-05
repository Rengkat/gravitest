export interface SystemTemplateContext {
  appName: string;
  year: number;
  appUrl: string;
  supportEmail?: string;
  logoUrl?: string;
}

/**
 * Common business variable required by most user-facing templates
 */
export interface UserTemplateContext {
  firstName: string;
}

/**
 * Final merged context seen inside handlebars during rendering
 */
export type BaseTemplateContext = SystemTemplateContext & UserTemplateContext;
