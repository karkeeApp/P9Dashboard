// Types
import { Option } from '@/types';
import { News } from '@/types/news';

export const NewsCategoryKeys: Array<keyof News> = [
  'is_news',
  'is_trending',
  'is_event',
  'is_happening',
  'is_guest',
];

export const NewsTypeOptions: Option<number>[] = [
  {
    key: 0,
    label: 'Private',
    value: 0,
  },
  {
    key: 1,
    label: 'Public',
    value: 1,
  },
];
