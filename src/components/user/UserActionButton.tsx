import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Space, Modal, notification } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

// Types
import { ResponseData } from '@/types/api';
import { User, UserStatus } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Components
import { EllipsisDropdown, Flex } from '@/components/shared';

export interface UserActionButtonProps {
  user: User;
  onRemove?: (user: User) => Promise<void> | void;
}

const UserActionButton: FC<UserActionButtonProps> = ({ user, onRemove }) => {
  const history = useHistory();
  const [removeModalVisibility, setRemoveModalVisibility] =
    useState<boolean>(false);
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);

  const handleShowRemoveModal = () => {
    setRemoveModalVisibility(true);
  };
  const handleHideRemoveModal = () => {
    setRemoveModalVisibility(false);
  };

  const handleRemove = async () => {
    try {
      setRemoveLoading(true);

      const deleteData: FormData = new FormData();
      deleteData.set('user_id', String(user.user_id));

      await API.post<ResponseData<User>>('/member/delete', deleteData);

      notification.success({
        message: (
          <span>
            Removed user <strong>{user.fullname}</strong>
          </span>
        ),
      });

      setRemoveLoading(false);
      setRemoveModalVisibility(false);

      if (onRemove) {
        void onRemove(user);
      }
    } catch (err) {
      setRemoveLoading(false);
    }
  };

  const actionMenu = (
    <Menu>
      <Menu.Item
        onClick={() => history.push(`${APP_PREFIX_PATH}/users/${user.user_id}`)}
      >
        <Flex alignItems='center'>
          <EyeOutlined />
          <span className='ml-2'>View</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          history.push(`${APP_PREFIX_PATH}/users/edit/${user.user_id}`)
        }
      >
        <Flex alignItems='center'>
          <EditOutlined />
          <span className='ml-2'>Edit</span>
        </Flex>
      </Menu.Item>
      {user.status !== UserStatus.DELETED && (
        <Menu.Item onClick={handleShowRemoveModal}>
          <Flex alignItems='center'>
            <DeleteOutlined />
            <span className='ml-2'>Remove</span>
          </Flex>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      <EllipsisDropdown menu={actionMenu} />

      {/* Remove Modal */}
      <Modal
        title='Confirm Removal'
        visible={removeModalVisibility}
        confirmLoading={removeLoading}
        maskClosable={false}
        okType='danger'
        okText='Remove'
        onOk={handleRemove}
        onCancel={handleHideRemoveModal}
      >
        <Space align='baseline'>
          <ExclamationCircleOutlined />
          <span>
            Are you sure you want to remove user{' '}
            <strong>{user.fullname}</strong>?
          </span>
        </Space>
      </Modal>
    </>
  );
};

export default UserActionButton;
