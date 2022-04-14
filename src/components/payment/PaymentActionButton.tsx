/* eslint-disable */
import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Space, Modal } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import update from 'immutability-helper';

// Types
import { ResponseData } from '@/types/api';
import { Payment, PaymentStatus } from '@/types/payment';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Components
import { EllipsisDropdown, Flex } from '@/components/shared';

export interface PaymentActionButtonProps {
  payment: Payment;
  onRemove?: (payment: Payment) => Promise<void> | void;
  onStatusUpdate?: (payment: Payment) => Promise<void> | void;
}

interface RemoveState {
  modalVisibility: boolean;
  loading: boolean;
}

interface StatusState {
  loading: boolean;
}

const PaymentActionButton: FC<PaymentActionButtonProps> = ({
  payment,
  onRemove,
  onStatusUpdate,
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
          $set: false,
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

      await API.delete<ResponseData<Payment>>(
        `/userpayment/delete/${payment.id}`,
      );

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
        void onRemove(payment);
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
  const handleConfirmApprove = async () => {
    try {
      setStatusState(
        update(statusState, {
          loading: {
            $set: true,
          },
        }),
      );

      await API.post('/userpayment/approve', null, {
        params: {
          id: payment.id,
        },
      });

      setStatusState(
        update(statusState, {
          loading: {
            $set: false,
          },
        }),
      );

      if (onStatusUpdate) {
        void onStatusUpdate(payment);
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

      await API.post('/userpayment/reject', null, {
        params: {
          id: payment.id,
        },
      });

      setStatusState(
        update(statusState, {
          loading: {
            $set: false,
          },
        }),
      );

      if (onStatusUpdate) {
        void onStatusUpdate(payment);
      }
    } catch (error) {
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
          history.push(`${APP_PREFIX_PATH}/payments/${payment.id}`)
        }
      >
        <Flex alignItems='center'>
          <EyeOutlined />
          <span className='ml-2'>View</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          history.push(`${APP_PREFIX_PATH}/payments/edit/${payment.id}`)
        }
      >
        <Flex alignItems='center'>
          <EditOutlined />
          <span className='ml-2'>Edit</span>
        </Flex>
      </Menu.Item>
      {(payment.status === PaymentStatus.PENDING ||
        payment.status === PaymentStatus.CONFIRMED) && (
        <>
          <Menu.Item onClick={handleConfirmApprove}>
            <Flex alignItems='center'>
              <CheckOutlined />
              <span className='ml-2'>
                {payment.status === PaymentStatus.CONFIRMED
                  ? 'Approve'
                  : 'Confirm'}
              </span>
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

      {payment.status !== PaymentStatus.DELETED && (
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
            Are you sure you want to remove payment with ID{' '}
            <strong>{payment.id}?</strong>
          </span>
        </Space>
      </Modal>
    </>
  );
};

export default PaymentActionButton;
/* eslint-enable */
