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
import { News, NewsStatus } from '@/types/news';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Components
import { EllipsisDropdown } from '@/components/shared';

export interface NewsActionButtonProps {
  news: News;
  onRemove?: () => Promise<void> | void;
}

const NewsActionButton: FC<NewsActionButtonProps> = ({ news, onRemove }) => {
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

  const handleRemoveNews = async () => {
    try {
      setRemoveLoading(true);

      await API.post<ResponseData<News>>(`/news/delete/${news.news_id}`);

      notification.success({
        message: (
          <span>
            Removed news <strong>{news.title}</strong>
          </span>
        ),
      });

      setRemoveLoading(false);
      setRemoveModalVisibility(false);

      if (onRemove) {
        void onRemove();
      }
    } catch (err) {
      setRemoveLoading(false);
    }
  };

  const actionMenu = (
    <Menu>
      <Menu.Item
        key='view'
        onClick={() =>
          history.push({
            pathname: `${APP_PREFIX_PATH}/news/${news.news_id}`,
          })
        }
      >
        <Space>
          <EyeOutlined />
          View
        </Space>
      </Menu.Item>
      <Menu.Item
        key='edit'
        onClick={() =>
          history.push({
            pathname: `${APP_PREFIX_PATH}/news/edit/${news.news_id}`,
          })
        }
      >
        <Space>
          <EditOutlined />
          Edit
        </Space>
      </Menu.Item>
      {news.status !== NewsStatus.DELETED && (
        <Menu.Item key='remove' onClick={handleShowRemoveModal}>
          <Space>
            <DeleteOutlined />
            Remove
          </Space>
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
        okType='danger'
        okText='Remove'
        onOk={handleRemoveNews}
        onCancel={handleHideRemoveModal}
      >
        <Space align='baseline'>
          <ExclamationCircleOutlined />
          <span>
            Are you sure you want to remove news <strong>{news.title}</strong>?
          </span>
        </Space>
      </Modal>
    </>
  );
};

export default NewsActionButton;
