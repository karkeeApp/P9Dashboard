import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Spin } from 'antd';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

// Types
import { ResponseData } from '@/types/api';
import { EventAttendee, EventAttendeeStatus } from '@/types/event';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Components
import { EllipsisDropdown, Flex } from '@/components/shared';

export interface EventAttendeeActionButtonProps {
  attendee: EventAttendee;
  onFinishConfirm?: (attendee: EventAttendee) => Promise<void> | void;
  onFinishCancel?: (attendee: EventAttendee) => Promise<void> | void;
}

const EventAttendeeActionButton: FC<EventAttendeeActionButtonProps> = ({
  attendee,
  onFinishConfirm,
  onFinishCancel,
}) => {
  const history = useHistory();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    try {
      setConfirmLoading(true);

      const confirmData: FormData = new FormData();
      confirmData.set('event_id', String(attendee.event_id));
      confirmData.set('attendee_id', String(attendee.id));

      await API.post<ResponseData<EventAttendee>>(
        '/event/confirm-attendee',
        confirmData,
      );

      setConfirmLoading(false);

      if (onFinishConfirm) {
        void onFinishConfirm(attendee);
      }
    } catch (err) {
      setConfirmLoading(false);
    }
  };
  const handleCancel = async () => {
    try {
      setCancelLoading(true);

      const cancelData: FormData = new FormData();
      cancelData.set('event_id', String(attendee.event_id));
      cancelData.set('attendee_id', String(attendee.id));

      await API.post<ResponseData<EventAttendee>>(
        '/event/cancel-attendee',
        cancelData,
      );

      setCancelLoading(false);

      if (onFinishCancel) {
        void onFinishCancel(attendee);
      }
    } catch (err) {
      setCancelLoading(false);
    }
  };

  const confirmMenuItem = (
    <Menu.Item onClick={handleConfirm}>
      <Flex alignItems='center'>
        <CheckOutlined />
        <span className='ml-2'>Confirm</span>
      </Flex>
    </Menu.Item>
  );
  const cancelMenuItem = (
    <Menu.Item onClick={handleCancel}>
      <Flex alignItems='center'>
        <CloseOutlined />
        <span className='ml-2'>Cancel</span>
      </Flex>
    </Menu.Item>
  );

  const renderMenuItems = () => {
    switch (attendee.status) {
      case EventAttendeeStatus.PENDING:
        return (
          <>
            {confirmMenuItem}
            {cancelMenuItem}
          </>
        );

      case EventAttendeeStatus.CANCELLED:
        return confirmMenuItem;

      case EventAttendeeStatus.CONFIRMED:
        return cancelMenuItem;

      default:
        return null;
    }
  };

  const actionMenu = (
    <Menu>
      <Menu.Item
        onClick={() =>
          history.push({
            pathname: `${APP_PREFIX_PATH}/members/${attendee.user_id}`,
          })
        }
      >
        <Flex alignItems='center'>
          <EyeOutlined />
          <span className='ml-2'>View Details</span>
        </Flex>
      </Menu.Item>
      {renderMenuItems()}
    </Menu>
  );

  return confirmLoading || cancelLoading ? (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  ) : (
    <EllipsisDropdown menu={actionMenu} />
  );
};

export default EventAttendeeActionButton;
