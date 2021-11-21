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
import { User, UserRole, UserStatus } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useAuth } from '@/hooks';

// Components
import { EllipsisDropdown, Flex } from '@/components/shared';

export interface AdminActionButtonProps {
  admin: User;
  onRemove?: (admin: User) => Promise<void> | void;
}

const AdminActionButton: FC<AdminActionButtonProps> = ({ admin, onRemove }) => {
  const history = useHistory();
  const { currentUser } = useAuth();
  const [removeModalVisibility, setRemoveModalVisibility] =
    useState<boolean>(false);
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);

  const handleShowRemoveModal = () => {
    let authorized = false;

    if (currentUser?.role === UserRole.MAIN_ADMIN) {
      if (
        admin.role === UserRole.MAIN_ADMIN ||
        admin.role === UserRole.SUB_ADMIN
      ) {
        authorized = true;
      }
    } else if (currentUser?.role === UserRole.SUB_ADMIN) {
      if (admin.role === UserRole.SUB_ADMIN) {
        authorized = true;
      }
    } else if (currentUser?.role === UserRole.SUPER_ADMIN) {
      authorized = true;
    }

    if (authorized) {
      setRemoveModalVisibility(true);
    } else {
      Modal.warning({
        title: 'You are unauthorized!',
        content: (
          <p>Please contact your administrator for elevated authorization.</p>
        ),
      });
    }
  };

  const handleRemove = async () => {
    try {
      setRemoveLoading(true);

      const deleteData: FormData = new FormData();
      deleteData.set('user_id', String(admin.user_id));

      await API.post<ResponseData<User>>('/member/delete', deleteData);

      notification.success({
        message: (
          <span>
            Removed admin <strong>{admin.fullname}</strong>
          </span>
        ),
      });

      setRemoveLoading(false);
      setRemoveModalVisibility(false);

      if (onRemove) {
        void onRemove(admin);
      }
    } catch (err) {
      setRemoveLoading(false);
    }
  };

  const actionMenu = (
    <Menu>
      <Menu.Item
        onClick={() =>
          history.push(`${APP_PREFIX_PATH}/admins/${admin.user_id}`)
        }
      >
        <Flex alignItems='center'>
          <EyeOutlined />
          <span className='ml-2'>View</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          history.push(`${APP_PREFIX_PATH}/admins/edit/${admin.user_id}`)
        }
      >
        <Flex alignItems='center'>
          <EditOutlined />
          <span className='ml-2'>Edit</span>
        </Flex>
      </Menu.Item>
      {admin.status !== UserStatus.DELETED && (
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
        onCancel={() => setRemoveModalVisibility(false)}
      >
        <Space align='baseline'>
          <ExclamationCircleOutlined />
          <span>
            Are you sure you want to remove admin{' '}
            <strong>{admin.fullname}</strong>?
          </span>
        </Space>
      </Modal>
    </>
  );
};

export default AdminActionButton;
