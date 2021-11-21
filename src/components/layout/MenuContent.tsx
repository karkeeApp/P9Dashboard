import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Grid } from 'antd';

// Types
import { NavMenu } from '@/types/nav';

// Constants
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from '@/constants/theme';

// Configs
import navigationConfig from '@/configs/nav';

// Redux
import { onMobileNavToggle } from '@/redux/actions/theme';

// Custom Hooks
import { useTheme } from '@/hooks';

// Utils
import utils from '@/utils';

// Components
import IntlMessage from '../util/IntlMessage';
import Icon from '../util/Icon';

const { SubMenu } = Menu;
const { useBreakpoint } = Grid;

const setLocale = (isLocaleOn: boolean, localeKey: string) =>
  isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString();

const getOpenKeys = (key: string) => {
  const keyList = [];
  let keyString = '';
  if (key) {
    const arr = key.split('-');
    for (let index = 0; index < arr.length; index++) {
      const elm = arr[index];
      if (index === 0) {
        keyString = elm;
      } else {
        keyString = `${keyString}-${elm}`;
      }
      keyList.push(keyString);
    }
  }
  return keyList;
};

interface SideNavContentProps {
  routeInfo: NavMenu;
  hideGroupTitle?: boolean;
  localization: boolean;
}

const SideNavContent: FC<SideNavContentProps> = ({
  routeInfo,
  hideGroupTitle,
  localization,
}) => {
  const dispatch = useDispatch();
  const { sideNavTheme } = useTheme();
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');

  const closeMobileNav = (): void => {
    if (isMobile) {
      dispatch(onMobileNavToggle(false));
    }
  };

  return (
    <Menu
      theme={sideNavTheme === SIDE_NAV_LIGHT ? 'light' : 'dark'}
      mode='inline'
      style={{ height: '100%', borderRight: 0 }}
      selectedKeys={[routeInfo.key]}
      defaultOpenKeys={getOpenKeys(routeInfo.key)}
      className={hideGroupTitle ? 'hide-group-title' : ''}
    >
      {navigationConfig.map((menu) =>
        menu.submenu.length > 0 ? (
          <Menu.ItemGroup
            key={menu.key}
            title={setLocale(localization, menu.name)}
          >
            {menu.submenu.map((subMenuFirst) =>
              subMenuFirst.submenu.length > 0 ? (
                <SubMenu
                  icon={
                    subMenuFirst.icon ? <Icon type={subMenuFirst.icon} /> : null
                  }
                  key={subMenuFirst.key}
                  title={setLocale(localization, subMenuFirst.name)}
                >
                  {subMenuFirst.submenu.map((subMenuSecond) => (
                    <Menu.Item key={subMenuSecond.key}>
                      {subMenuSecond.icon ? (
                        <Icon type={subMenuSecond.icon} />
                      ) : null}
                      <span>{setLocale(localization, subMenuSecond.name)}</span>
                      <Link
                        onClick={() => closeMobileNav()}
                        to={subMenuSecond.path}
                      />
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={subMenuFirst.key}>
                  {subMenuFirst.icon ? <Icon type={subMenuFirst.icon} /> : null}
                  <span>{setLocale(localization, subMenuFirst.name)}</span>
                  <Link
                    onClick={() => closeMobileNav()}
                    to={subMenuFirst.path}
                  />
                </Menu.Item>
              ),
            )}
          </Menu.ItemGroup>
        ) : (
          <Menu.Item key={menu.key}>
            {menu.icon ? <Icon type={menu?.icon} /> : null}
            <span>{setLocale(localization, menu?.name)}</span>
            {menu.path ? (
              <Link onClick={() => closeMobileNav()} to={menu.path} />
            ) : null}
          </Menu.Item>
        ),
      )}
    </Menu>
  );
};

interface TopNavContentProps {
  localization: boolean;
}

const TopNavContent: FC<TopNavContentProps> = ({ localization }) => {
  const { topNavColor } = useTheme();

  return (
    <Menu mode='horizontal' style={{ backgroundColor: topNavColor }}>
      {navigationConfig.map((menu) =>
        menu.submenu.length > 0 ? (
          <SubMenu
            key={menu.key}
            popupClassName='top-nav-menu'
            title={
              <span>
                {menu.icon ? <Icon type={menu?.icon} /> : null}
                <span>{setLocale(localization, menu.name)}</span>
              </span>
            }
          >
            {menu.submenu.map((subMenuFirst) =>
              subMenuFirst.submenu.length > 0 ? (
                <SubMenu
                  key={subMenuFirst.key}
                  icon={
                    subMenuFirst.icon ? (
                      <Icon type={subMenuFirst?.icon} />
                    ) : null
                  }
                  title={setLocale(localization, subMenuFirst.name)}
                >
                  {subMenuFirst.submenu.map((subMenuSecond) => (
                    <Menu.Item key={subMenuSecond.key}>
                      <span>{setLocale(localization, subMenuSecond.name)}</span>
                      <Link to={subMenuSecond.path} />
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={subMenuFirst.key}>
                  {subMenuFirst.icon ? (
                    <Icon type={subMenuFirst?.icon} />
                  ) : null}
                  <span>{setLocale(localization, subMenuFirst.name)}</span>
                  <Link to={subMenuFirst.path} />
                </Menu.Item>
              ),
            )}
          </SubMenu>
        ) : (
          <Menu.Item key={menu.key}>
            {menu.icon ? <Icon type={menu?.icon} /> : null}
            <span>{setLocale(localization, menu?.name)}</span>
            {menu.path ? <Link to={menu.path} /> : null}
          </Menu.Item>
        ),
      )}
    </Menu>
  );
};

interface MenuContentProps {
  type: string;
  routeInfo: NavMenu;
  hideGroupTitle?: boolean;
  localization: boolean;
}

const MenuContent: FC<MenuContentProps> = ({
  type,
  routeInfo,
  hideGroupTitle,
  localization,
}) =>
  type === NAV_TYPE_SIDE ? (
    <SideNavContent
      routeInfo={routeInfo}
      hideGroupTitle={hideGroupTitle}
      localization={localization}
    />
  ) : (
    <TopNavContent localization={localization} />
  );
export default MenuContent;
