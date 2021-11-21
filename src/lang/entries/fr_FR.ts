import antdFrFR from 'antd/es/locale/fr_FR';

// Types
import { LangEntry } from '@/types/lang';

// Locales
import frMsg from '../locales/fr_FR.json';

const FrLang: LangEntry = {
  antd: antdFrFR,
  locale: 'fr-FR',
  messages: {
    ...frMsg,
  },
};

export default FrLang;
