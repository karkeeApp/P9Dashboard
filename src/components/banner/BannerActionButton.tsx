/* eslint-disable */
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
import { Banner, BannerStatus } from '@/types/banner';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Components
import { EllipsisDropdown, Flex } from '@/components/shared';

export interface BannerActionButtonProps {
  banner: Banner;
  onRemove?: (banner: Banner) => Promise<void> | void;
}

const BannerActionButton: FC<BannerActionButtonProps> = ({
  banner,
  onRemove,
}) => {
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

      await API.post<ResponseData<Banner>>(`/banner/delete/${banner.id}`);

      notification.success({
        message: (
          <span>
            Removed banner <strong>{banner.title}</strong>
          </span>
        ),
      });

      setRemoveLoading(false);
      setRemoveModalVisibility(false);

      if (onRemove) {
        void onRemove(banner);
      }
    } catch (err) {
      setRemoveLoading(false);
    }
  };

  const actionMenu = (
    <Menu>
      <Menu.Item
        onClick={() =>
          history.push({
            pathname: `${APP_PREFIX_PATH}/banners/${banner.id}`,
          })
        }
      >
        <Flex alignItems='center'>
          <EyeOutlined />
          <span className='ml-2'>View Details</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          history.push({
            pathname: `${APP_PREFIX_PATH}/banners/edit/${banner.id}`,
          })
        }
      >
        <Flex alignItems='center'>
          <EditOutlined />
          <span className='ml-2'>Edit</span>
        </Flex>
      </Menu.Item>
      {banner.status !== BannerStatus.DELETED && (
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
            Are you sure you want to remove banner{' '}
            <strong>{banner.title}</strong>
          </span>
        </Space>
      </Modal>
    </>
  );
};

export default BannerActionButton;
/* eslint-enable */
