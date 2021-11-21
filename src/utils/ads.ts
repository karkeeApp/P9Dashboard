import { TagProps } from 'antd';

// Types
import { Ads, AdsStatus } from '@/types/ads';

export function getAdsStatusTagColor(status: Ads['status']): TagProps['color'] {
  switch (status) {
    case AdsStatus.DELETED:
      return 'red';

    case AdsStatus.ACTIVE:
      return 'green';

    default:
      return 'default';
  }
}
