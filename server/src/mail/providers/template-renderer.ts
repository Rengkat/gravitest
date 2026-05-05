import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import * as handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';
import { htmlToText } from 'html-to-text';
import { BaseTemplateContext } from '../interfaces/template-context.interface';
import appConfig from 'src/config/appConfig';
import mailConfig from '../config/mailConfig';

interface RenderedTemplate {
  html: string;
  text: string;
}

@Injectable()
export class TemplateRendererProvider implements OnModuleInit {
  private readonly logger = new Logger(TemplateRendererProvider.name);
  private readonly cache = new Map<string, handlebars.TemplateDelegate>();
  private readonly templatesDir: string;
  private baseContext!: Omit<BaseTemplateContext, 'firstName'>;

  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,

    @Inject(mailConfig.KEY)
    private readonly mailConfiguration: ConfigType<typeof mailConfig>,
  ) {
    this.templatesDir = path.join(__dirname, '..', 'templates');
  }

  async onModuleInit(): Promise<void> {
    this.baseContext = {
      appName: this.appConfiguration.name,
      appUrl: this.appConfiguration.frontendUrl,
      logoUrl: this.appConfiguration.logoUrl,
      supportEmail: this.mailConfiguration.supportAddress,
      year: new Date().getFullYear(),
    };

    await this.registerPartials();
    this.registerHelpers();
    await this.preloadTemplates();

    this.logger.log('Mail templates initialized');
  }

  async render<T extends Partial<BaseTemplateContext>>(
    templateName: string,
    context: T,
  ): Promise<RenderedTemplate> {
    const compiled = await this.getCompiledTemplate(templateName);
    const merged = { ...this.baseContext, ...context };

    const html = compiled(merged);
    const text = htmlToText(html, { wordwrap: 120 });

    return { html, text };
  }

  private async preloadTemplates(): Promise<void> {
    try {
      const files = await fs.readdir(this.templatesDir);

      for (const file of files.filter((f) => f.endsWith('.hbs'))) {
        const templateName = path.basename(file, '.hbs');
        await this.getCompiledTemplate(templateName);
      }
    } catch {
      this.logger.warn('No root templates found during preload');
    }
  }

  private async getCompiledTemplate(
    name: string,
  ): Promise<handlebars.TemplateDelegate> {
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    const filePath = path.join(this.templatesDir, `${name}.hbs`);
    const source = await fs.readFile(filePath, 'utf-8');
    const compiled = handlebars.compile(source);

    this.cache.set(name, compiled);
    return compiled;
  }

  private async registerPartials(): Promise<void> {
    const partialsDir = path.join(this.templatesDir, 'partials');

    try {
      const files = await fs.readdir(partialsDir);

      for (const file of files.filter((f) => f.endsWith('.hbs'))) {
        const name = path.basename(file, '.hbs');
        const content = await fs.readFile(
          path.join(partialsDir, file),
          'utf-8',
        );
        handlebars.registerPartial(name, content);
      }
    } catch {
      this.logger.debug('No partials directory found');
    }
  }

  private registerHelpers(): void {
    handlebars.registerHelper('eq', (a, b) => a === b);

    handlebars.registerHelper('upper', (str: string) =>
      typeof str === 'string' ? str.toUpperCase() : str,
    );

    handlebars.registerHelper('formatDate', (date: string | Date) =>
      new Date(date).toLocaleString('en-NG', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Africa/Lagos',
      }),
    );
  }
}
