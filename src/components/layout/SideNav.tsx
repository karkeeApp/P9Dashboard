import { FC } from 'react';
import { Layout } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

// Types
import { NavMenu } from '@/types/nav';

// Constants
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_DARK,
  NAV_TYPE_SIDE,
} from '@/constants/theme';

// Custom Hooks
import { useTheme } from '@/hooks';

// Components
import MenuContent from './MenuContent';

const { Sider } = Layout;

interface SideNavProps {
  routeInfo: NavMenu;
  hideGroupTitle?: boolean;
  localization?: boolean;
}

const SideNav: FC<SideNavProps> = ({
  routeInfo,
  hideGroupTitle,
  localization = true,
}) => {
  const { navCollapsed, sideNavTheme } = useTheme();

  return (
    <Sider
      className={`side-nav ${
        sideNavTheme === SIDE_NAV_DARK ? 'side-nav-dark' : ''
      }`}
      width={SIDE_NAV_WIDTH}
      collapsed={navCollapsed}
    >
      <Scrollbars autoHide>
        <MenuContent
          type={NAV_TYPE_SIDE}
          routeInfo={routeInfo}
          hideGroupTitle={hideGroupTitle}
          localization={localization}
        />
      </Scrollbars>
    </Sider>
  );
};

export default SideNav;
