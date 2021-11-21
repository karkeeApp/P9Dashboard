// Types
import { LangEntry } from '@/types/lang';

// Locales
import enLang from './entries/en_US';
import zhLang from './entries/zh_CN';
import frLang from './entries/fr_FR';
import jaLang from './entries/ja_JP';

const AppLocale: Record<string, LangEntry> = {
  en: enLang,
  zh: zhLang,
  fr: frLang,
  ja: jaLang,
};

export default AppLocale;
