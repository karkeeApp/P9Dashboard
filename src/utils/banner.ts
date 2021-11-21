import { TagProps } from 'antd';

// Types
import { Banner, BannerStatus } from '@/types/banner';

export function getBannerStatusTagColor(
  status: Banner['status'],
): TagProps['color'] {
  switch (status) {
    case BannerStatus.DELETED:
      return 'red';

    case BannerStatus.ACTIVE:
      return 'green';

    case BannerStatus.INACTIVE:
      return 'default';

    default:
      return 'default';
  }
}
