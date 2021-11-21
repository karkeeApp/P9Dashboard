import { Locale } from 'antd/lib/locale-provider';

export interface LangEntry {
  antd: Locale;
  locale: Locale['locale'];
  messages: Record<string, string>;
}
