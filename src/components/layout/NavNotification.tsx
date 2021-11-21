import { FC, useState } from 'react';
import { Menu, Dropdown, Badge, Avatar, List } from 'antd';
import {
  // MailOutlined,
  BellOutlined,
  // WarningOutlined,
  // CheckCircleOutlined,
} from '@ant-design/icons';
import * as timeago from 'timeago.js';

// Types
import { Notification } from '@/types/notification';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Components
import Flex from '@/components/shared/Flex';

// Assets
// import notificationData from '@/assets/data/notification.data.json';

// const getIcon = (icon: string) => {
//   switch (icon) {
//     case 'mail':
//       return <MailOutlined />;
//     case 'alert':
//       return <WarningOutlined />;
//     case 'check':
//       return <CheckCircleOutlined />;
//     default:
//       return <MailOutlined />;
//   }
// };

// const getNotificationBody = (list: typeof notificationData) =>
//   list.length > 0 ? (
//     <List
//       size='small'
//       itemLayout='horizontal'
//       dataSource={list}
//       renderItem={(item) => (
//         <List.Item className='list-clickable'>
//           <Flex alignItems='center'>
//             <div className='pr-3'>
//               {item.img ? (
//                 <Avatar src={`/img/avatars/${item.img}`} />
//               ) : (
//                 <Avatar
//                   className={`ant-avatar-${item.type}`}
//                   icon={getIcon(item.icon)}
//                 />
//               )}
//             </div>
//             <div className='mr-3'>
//               <span className='font-weight-bold text-dark'>{item.name} </span>
//               <span className='text-gray-light'>{item.desc}</span>
//             </div>
//             <small className='ml-auto'>{item.time}</small>
//           </Flex>
//         </List.Item>
//       )}
//     />
//   ) : (
//     <div className='empty-notification'>
//       <img
//         src='https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg'
//         alt='empty'
//       />
//       <p className='mt-3'>You have viewed all notifications</p>
//     </div>
//   );

const getNotificationBody = (list: Notification[]) =>
  list.length > 0 ? (
    <List
      size='small'
      itemLayout='horizontal'
      dataSource={list}
      renderItem={(item) => (
        <List.Item className='list-clickable'>
          <Flex alignItems='center'>
            <div className='pr-3'>
              <Avatar src={item.user.img_profile} />
            </div>
            <div className='mr-3'>
              <span className='font-weight-bold text-dark'>
                {item.user.fullname}{' '}
              </span>
              <span className='text-gray-light'>{item.message}</span>
            </div>
            <small className='ml-auto'>
              {timeago.format(item.created_at as string)}
            </small>
          </Flex>
        </List.Item>
      )}
    />
  ) : (
    <div className='empty-notification'>
      <img
        src='https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg'
        alt='empty'
      />
      <p className='mt-3'>You have viewed all notifications</p>
    </div>
  );

export const NavNotification: FC = () => {
  const { notifications } = useGlobal();
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  const notificationList = (
    <div className='nav-dropdown nav-notification'>
      <div className='nav-notification-header d-flex justify-content-between align-items-center'>
        <h4 className='mb-0'>Notification</h4>
        {/* <Button type='link' size='small'>
          Clear{' '}
        </Button> */}
      </div>
      <div className='nav-notification-body'>
        {getNotificationBody(notifications)}
      </div>
      {/* {notifications.length > 0 ? (
        <div className='nav-notification-footer'>
          <a className='d-block' href='#/'>
            View all
          </a>
        </div>
      ) : null} */}
    </div>
  );

  return (
    <Dropdown
      placement='bottomRight'
      overlay={notificationList}
      onVisibleChange={handleVisibleChange}
      visible={visible}
      trigger={['click']}
    >
      <Menu mode='horizontal' selectable={false}>
        <Menu.Item>
          <Badge count={notifications.length}>
            <BellOutlined className='nav-icon mx-auto' type='bell' />
          </Badge>
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
};

export default NavNotification;
