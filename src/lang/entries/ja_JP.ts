import antdJaJP from 'antd/es/locale/ja_JP';

// Types
import { LangEntry } from '@/types/lang';

// Locales
import jaMsg from '../locales/ja_JP.json';

const JaLang: LangEntry = {
  antd: antdJaJP,
  locale: 'ja-JP',
  messages: {
    ...jaMsg,
  },
};
export default JaLang;
