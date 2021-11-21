import antdZhCn from 'antd/es/locale/zh_CN';

// Types
import { LangEntry } from '@/types/lang';

// Locales
import zhMsg from '../locales/zh_CN.json';

const ZhLang: LangEntry = {
  antd: antdZhCn,
  locale: 'zh',
  messages: {
    ...zhMsg,
  },
};
export default ZhLang;
