import { TagProps } from 'antd';

// Types
import { SponsorLevel } from '@/types/sponsor';

export function getSponsorLevelColor(level: SponsorLevel): TagProps['color'] {
  switch (level) {
    case SponsorLevel.SILVER:
      return 'sienna';

    case SponsorLevel.GOLD:
      return 'gold';

    case SponsorLevel.PLATINUM:
      return 'darkviolet';

    case SponsorLevel.DIAMOND:
      return 'indianred';

    default:
      return '#73879C';
  }
}
