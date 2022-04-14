/* eslint-disable */
import { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Dropdown, Avatar, Skeleton } from 'antd';
import {
  EditOutlined,
  // SettingOutlined,
  // ShopOutlined,
  // QuestionCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';

// Configs
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useAuth, useGlobal } from '@/hooks';

// Redux Constants
import { AUTH_TOKEN } from '@/redux/constants/auth';

// Redux Actions
import { setUser } from '@/redux/actions/auth';

// const menuItem = [
//   {
//     title: 'Edit Profile',
//     icon: EditOutlined,
//     path: '/',
//   },

//   {
//     title: 'Account Setting',
//     icon: SettingOutlined,
//     path: '/',
//   },
//   {
//     title: 'Billing',
//     icon: ShopOutlined,
//     path: '/',
//   },
//   {
//     title: 'Help Center',
//     icon: QuestionCircleOutlined,
//     path: '/',
//   },
// ];

const NavProfile: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { settings } = useGlobal();

  const role = useMemo(() => {
    if (currentUser !== null) {
      return settings.user_roles.find((s) => s.value === currentUser.role)
        ?.label;
    }

    return '';
  }, [settings.user_roles]);

  const handleSignOut = () => {
    localStorage.removeItem(AUTH_TOKEN);
    dispatch(setUser(null));
    history.push({
      pathname: `${AUTH_PREFIX_PATH}/login`,
    });
  };

  const renderProfileMenu = () => {
    if (currentUser) {
      return (
        <div className='nav-profile nav-dropdown'>
          <div className='nav-profile-header'>
            <div className='d-flex'>
              <Avatar
                size={45}
                src={
                  currentUser !== null ? (
                    currentUser.img_profile
                  ) : (
                    <Skeleton.Image />
                  )
                }
              />
              <div className='pl-3'>
                <h4 className='mb-0'>
                  {currentUser !== null ? currentUser.fullname : ''}
                </h4>
                <span className='text-muted'>{role}</span>
              </div>
            </div>
          </div>
          <div className='nav-profile-body'>
            <Menu selectable={false}>
              {/* {menuItem.map((el, i) => {
            return (
              <Menu.Item key={i}>
                <a href={el.path}>
                  <Icon className='mr-3' type={el.icon} />
                  <span className='font-weight-normal'>{el.title}</span>
                </a>
              </Menu.Item>
            );
          })} */}
              <Menu.Item
                onClick={() =>
                  history.push({
                    pathname: `${APP_PREFIX_PATH}/admins/edit/${currentUser.user_id}`,
                  })
                }
              >
                <span>
                  <EditOutlined className='mr-3' />
                  <span className='font-weight-normal'>Edit Profile</span>
                </span>
              </Menu.Item>
              <Menu.Item onClick={handleSignOut}>
                <span>
                  <LogoutOutlined className='mr-3' />
                  <span className='font-weight-normal'>Sign Out</span>
                </span>
              </Menu.Item>
            </Menu>
          </div>
        </div>
      );
    }

    return <div />;
  };

  return (
    <Dropdown
      placement='bottomRight'
      overlay={renderProfileMenu()}
      trigger={['click']}
    >
      <Menu
        className='d-flex align-item-center'
        mode='horizontal'
        selectable={false}
      >
        <Menu.Item>
          <Avatar
            src={
              currentUser !== null ? (
                currentUser.img_profile
              ) : (
                <Skeleton.Image />
              )
            }
          />
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
};

export default NavProfile;
/* eslint-enable */
