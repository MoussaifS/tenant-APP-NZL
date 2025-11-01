import type { EnMessages } from './en';
import type { ArMessages } from './ar';
import { en } from './en';
import { ar } from './ar';

export type SupportedLocale = 'en' | 'ar';
export type Messages = EnMessages & ArMessages;

export const messages: Record<SupportedLocale, Messages> = {
  en,
  ar,
};

export function getMessages(locale: SupportedLocale): Messages {
  return messages[locale] ?? en;
}

