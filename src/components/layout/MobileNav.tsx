import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Drawer } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';

// Types
import { NavMenu } from '@/types/nav';

// Constants
import { NAV_TYPE_SIDE } from '@/constants/theme';

// Redux
import { onMobileNavToggle } from '@/redux/actions/theme';

// Cusom Hooks
import { useTheme } from '@/hooks';

// Components
import Flex from '@/components/shared/Flex';
import MenuContent from './MenuContent';
import Logo from './Logo';

interface MobileNavProps {
  routeInfo: NavMenu;
  hideGroupTitle?: boolean;
  localization?: boolean;
}

export const MobileNav: FC<MobileNavProps> = ({
  routeInfo,
  hideGroupTitle,
  localization = true,
}) => {
  const dispatch = useDispatch();
  const { mobileNav } = useTheme();

  const handleClose = () => {
    dispatch(onMobileNavToggle(false));
  };

  return (
    <Drawer
      placement='left'
      closable={false}
      onClose={handleClose}
      visible={mobileNav}
      bodyStyle={{ padding: 5 }}
    >
      <Flex flexDirection='column' className='h-100'>
        <Flex justifyContent='between' alignItems='center'>
          <Logo mobileLogo />
          <div className='nav-close' role='none' onClick={handleClose}>
            <ArrowLeftOutlined />
          </div>
        </Flex>
        <div className='mobile-nav-menu'>
          <Scrollbars autoHide>
            <MenuContent
              type={NAV_TYPE_SIDE}
              routeInfo={routeInfo}
              hideGroupTitle={hideGroupTitle}
              localization={localization}
            />
          </Scrollbars>
        </div>
      </Flex>
    </Drawer>
  );
};

export default MobileNav;
