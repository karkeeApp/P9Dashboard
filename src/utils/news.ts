import { TagProps } from 'antd';

// Types
import { News, NewsStatus } from '@/types/news';

export function getNewsStatusTagColor(
  status: News['status'],
): TagProps['color'] {
  switch (status) {
    case NewsStatus.ACTIVE:
      return 'green';

    case NewsStatus.DELETED:
      return 'red';

    default:
      return 'default';
  }
}
