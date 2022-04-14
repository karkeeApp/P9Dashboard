/* eslint-disable */
import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Spin } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

// Types
import { ResponseData } from '@/types/api';
import { ClubMember, ClubMemberStatus } from '@/types/club';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Components
import { EllipsisDropdown, Flex } from '@/components/shared';

export interface ClubMemberActionButtonProps {
  member: ClubMember;
  onApprove?: (member: ClubMember) => Promise<void> | void;
  onReject?: (member: ClubMember) => Promise<void> | void;
}

const ClubMemberActionButton: FC<ClubMemberActionButtonProps> = ({
  member,
  onApprove,
  onReject,
}) => {
  const history = useHistory();
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [rejectLoading, setRejectlLoading] = useState<boolean>(false);

  const handleApprove = async () => {
    try {
      setApproveLoading(true);

      const approveData: FormData = new FormData();
      approveData.set('membership_id', String(member.id));

      await API.post<ResponseData<ClubMember>>(
        '/account/account-membership-approve',
        approveData,
      );

      setApproveLoading(false);

      if (onApprove) {
        void onApprove(member);
      }
    } catch (err) {
      setApproveLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      setRejectlLoading(true);

      const rejectData: FormData = new FormData();
      rejectData.set('membership_id', String(member.id));

      await API.post<ResponseData<ClubMember>>(
        '/account/account-membership-reject',
        rejectData,
      );

      setRejectlLoading(false);

      if (onReject) {
        void onReject(member);
      }
    } catch (err) {
      setRejectlLoading(false);
    }
  };

  const approveMenuItem = (
    <Menu.Item onClick={handleApprove}>
      <Flex alignItems='center'>
        <CheckOutlined />
        <span className='ml-2'>Approve</span>
      </Flex>
    </Menu.Item>
  );
  const rejectMenuItem = (
    <Menu.Item onClick={handleReject}>
      <Flex alignItems='center'>
        <CloseOutlined />
        <span className='ml-2'>Reject</span>
      </Flex>
    </Menu.Item>
  );

  const renderMenuItems = () => {
    switch (member.status) {
      case ClubMemberStatus.PENDING:
        return (
          <>
            {approveMenuItem}
            {rejectMenuItem}
          </>
        );

      case ClubMemberStatus.REJECTED:
        return approveMenuItem;

      default:
        return null;
    }
  };

  const actionMenu = (
    <Menu>
      <Menu.Item
        onClick={() =>
          history.push(`${APP_PREFIX_PATH}/members/${member.user_id}`)
        }
      >
        <Flex alignItems='center'>
          <EyeOutlined />
          <span className='ml-2'>View</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          history.push(`${APP_PREFIX_PATH}/members/edit/${member.user_id}`)
        }
      >
        <Flex alignItems='center'>
          <EditOutlined />
          <span className='ml-2'>Edit</span>
        </Flex>
      </Menu.Item>
      {renderMenuItems()}
    </Menu>
  );

  return approveLoading || rejectLoading ? (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  ) : (
    <EllipsisDropdown menu={actionMenu} />
  );
};

export default ClubMemberActionButton;
/* eslint-enable */
