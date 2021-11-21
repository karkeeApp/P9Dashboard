import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Space, Modal, notification } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import update from 'immutability-helper';

// Types
import { ResponseData } from '@/types/api';
import { Listing, ListingStatus } from '@/types/listing';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Cmponents
import { EllipsisDropdown, Flex } from '@/components/shared';

export interface ListingActionButtonProps {
  listing: Listing;
  onRemove?: (listing: Listing) => Promise<void> | void;
  onApprove?: (listing: Listing) => Promise<void> | void;
  onReject?: (listing: Listing) => Promise<void> | void;
}

interface RemoveState {
  modalVisibility: boolean;
  loading: boolean;
}

interface StatusState {
  loading: boolean;
}

const ListingActionButton: FC<ListingActionButtonProps> = ({
  listing,
  onRemove,
  onApprove,
  onReject,
}) => {
  const history = useHistory();
  const [removeState, setRemoveState] = useState<RemoveState>({
    modalVisibility: false,
    loading: false,
  });
  const [statusState, setStatusState] = useState<StatusState>({
    loading: false,
  });

  // Remove Handlers
  const handleShowRemoveModal = () => {
    setRemoveState(
      update(removeState, {
        modalVisibility: {
          $set: true,
        },
      }),
    );
  };
  const handleHideRemoveModal = () => {
    setRemoveState(
      update(removeState, {
        modalVisibility: {
          $set: true,
        },
      }),
    );
  };
  const handleRemove = async () => {
    try {
      setRemoveState(
        update(removeState, {
          loading: {
            $set: true,
          },
        }),
      );

      await API.delete<ResponseData<Listing>>('/listing/delete', {
        params: {
          id: listing.listing_id,
        },
      });

      notification.success({
        message: (
          <span>
            Removed listing <strong>{listing.title}</strong>
          </span>
        ),
      });

      setRemoveState(
        update(removeState, {
          modalVisibility: {
            $set: false,
          },
          loading: {
            $set: false,
          },
        }),
      );

      if (onRemove) {
        void onRemove(listing);
      }
    } catch (err) {
      setRemoveState(
        update(removeState, {
          loading: {
            $set: false,
          },
        }),
      );
    }
  };

  // Status Handlers
  const handleApprove = async () => {
    try {
      setStatusState(
        update(statusState, {
          loading: {
            $set: true,
          },
        }),
      );

      const approveData: FormData = new FormData();
      approveData.set('id', String(listing.listing_id));

      await API.post('/listing/approve', approveData);

      setStatusState(
        update(statusState, {
          loading: {
            $set: false,
          },
        }),
      );

      if (onApprove) {
        void onApprove(listing);
      }
    } catch (err) {
      setStatusState(
        update(statusState, {
          loading: {
            $set: false,
          },
        }),
      );
    }
  };
  const handleReject = async () => {
    try {
      setStatusState(
        update(statusState, {
          loading: {
            $set: true,
          },
        }),
      );

      const rejectData: FormData = new FormData();
      rejectData.set('id', String(listing.listing_id));

      await API.post('/listing/reject', rejectData);

      setStatusState(
        update(statusState, {
          loading: {
            $set: false,
          },
        }),
      );

      if (onReject) {
        void onReject(listing);
      }
    } catch (err) {
      setStatusState(
        update(statusState, {
          loading: {
            $set: false,
          },
        }),
      );
    }
  };

  const actionMenu = (
    <Menu>
      <Menu.Item
        onClick={() =>
          history.push({
            pathname: `${APP_PREFIX_PATH}/listings/${listing.listing_id}`,
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
            pathname: `${APP_PREFIX_PATH}/listings/edit/${listing.listing_id}`,
          })
        }
      >
        <Flex alignItems='center'>
          <EditOutlined />
          <span className='ml-2'>Edit</span>
        </Flex>
      </Menu.Item>
      {listing.status === ListingStatus.PENDING && (
        <>
          <Menu.Item onClick={handleApprove}>
            <Flex alignItems='center'>
              <CheckOutlined />
              <span className='ml-2'>Approve</span>
            </Flex>
          </Menu.Item>
          <Menu.Item onClick={handleReject}>
            <Flex alignItems='center'>
              <CloseOutlined />
              <span className='ml-2'>Reject</span>
            </Flex>
          </Menu.Item>
        </>
      )}
      {listing.status !== ListingStatus.DELETED && (
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
        visible={removeState.modalVisibility}
        confirmLoading={removeState.loading}
        maskClosable={false}
        okType='danger'
        okText='Remove'
        onOk={handleRemove}
        onCancel={handleHideRemoveModal}
      >
        <Space align='baseline'>
          <ExclamationCircleOutlined />
          <span>
            Are you sure you want to remove listing{' '}
            <strong>{listing.title}</strong>
          </span>
        </Space>
      </Modal>
    </>
  );
};

export default ListingActionButton;
