import antdEnUS from 'antd/es/locale/en_US';

// Types
import { LangEntry } from '@/types/lang';

// Locales
import enMsg from '../locales/en_US.json';

const EnLang: LangEntry = {
  antd: antdEnUS,
  locale: 'en-US',
  messages: {
    ...enMsg,
  },
};

export default EnLang;
