import type { EnMessages } from './en';
import type { ArMessages } from './ar';
import type { EsMessages } from './es';
import type { ZhMessages } from './zh';
import { en } from './en';
import { ar } from './ar';
import { es } from './es';
import { zh } from './zh';

export type SupportedLocale = 'en' | 'ar' | 'es' | 'zh';
export type Messages = EnMessages & ArMessages & EsMessages & ZhMessages;

export const messages: Record<SupportedLocale, Messages> = {
  en,
  ar,
  es,
  zh,
};

export function getMessages(locale: SupportedLocale): Messages {
  return messages[locale] ?? en;
}

