import { FC } from 'react';

// Types
import { NavMenu } from '@/types/nav';

// Constants
import { NAV_TYPE_TOP } from '@/constants/theme';

// Custom Hooks
import { useTheme } from '@/hooks';

// Utils
import utils from '@/utils';

// Components
import MenuContent from './MenuContent';

interface TopNavProps {
  routeInfo: NavMenu;
  localization?: boolean;
}

const TopNav: FC<TopNavProps> = ({ routeInfo, localization = true }) => {
  const { topNavColor } = useTheme();
  return (
    <div
      className={`top-nav ${utils.getColorContrast(topNavColor)}`}
      style={{ backgroundColor: topNavColor }}
    >
      <div className='top-nav-wrapper'>
        <MenuContent
          type={NAV_TYPE_TOP}
          routeInfo={routeInfo}
          localization={localization}
        />
      </div>
    </div>
  );
};

export default TopNav;
