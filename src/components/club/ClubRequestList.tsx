import { FC, ChangeEventHandler } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Card,
  PaginationProps,
  Input,
  Select,
  SelectProps,
  Table,
  TableProps,
  Tag,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

// Types
import { Pagination } from '@/types';
import { ClubMember, ClubMemberStatus } from '@/types/club';
import { AdminSetting } from '@/types/user';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getClubMemberStatusTagColor } from '@/utils/club';

// Components
import { Flex, AvatarStatus } from '@/components/shared';
import ClubMemberActionButton, {
  ClubMemberActionButtonProps,
} from './ClubMemberActionButton';

export interface ClubRequestListProps {
  loading: boolean;
  pagination: Pagination;
  total: number;
  requests: ClubMember[];
  onSearch: ChangeEventHandler<HTMLInputElement>;
  onChangePagination: PaginationProps['onChange'];
  onChangeSelectedType: SelectProps<AdminSetting['id'] | 'all'>['onChange'];
  onChangeSelectedStatus: SelectProps<AdminSetting['id']>['onChange'];
  onApprove: ClubMemberActionButtonProps['onApprove'];
  onReject: ClubMemberActionButtonProps['onReject'];
}

const ClubRequestList: FC<ClubRequestListProps> = ({
  loading,
  pagination,
  total,
  requests,
  onSearch,
  onChangePagination,
  onChangeSelectedType,
  onChangeSelectedStatus,
  onApprove,
  onReject,
}) => {
  const history = useHistory();
  const { settings } = useGlobal();

  const columns: TableProps<ClubMember>['columns'] = [
    {
      key: 'user_id',
      dataIndex: 'user_id',
      title: 'ID',
    },
    {
      key: 'fullname',
      dataIndex: ['user', 'fullname'],
      title: 'Member',
      render: (fullname: ClubMember['user']['fullname'], member) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={member.user.img_profile}
            name={fullname}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/members/${member.user_id}`,
              })
            }
          />
        </div>
      ),
    },
    {
      key: 'email',
      dataIndex: ['user', 'email'],
      title: 'Email',
    },
    {
      key: 'created_at',
      dataIndex: ['user', 'created_at'],
      title: 'Date Created',
      render: (created_at: ClubMember['user']['created_at']) =>
        moment(created_at).format('MMMM DD, YYYY'),
    },
    {
      key: 'member_type',
      dataIndex: ['user', 'member_type'],
      title: 'Member Type',
      render: (member_type: ClubMember['user']['member_type']) =>
        settings.member_types.find((t) => t.value === member_type)?.label,
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render: (status: ClubMember['status']) => (
        <Tag color={getClubMemberStatusTagColor(status)}>
          {
            settings.account_membership_status.find((s) => s.value === status)
              ?.label
          }
        </Tag>
      ),
    },
    {
      key: 'actions',
      render: (member: ClubMember) => (
        <div className='text-right'>
          <ClubMemberActionButton
            member={member}
            onApprove={onApprove}
            onReject={onReject}
          />
        </div>
      ),
    },
  ];

  return (
    <Card>
      {/* Header */}
      <Flex alignItems='center' justifyContent='between' mobileFlex={false}>
        <Flex className='mb-1' mobileFlex={false}>
          <div className='mr-md-2 mb-3'>
            <Input
              placeholder='Search'
              prefix={<SearchOutlined />}
              onChange={onSearch}
            />
          </div>
          <div className='mr-md-2 mb-3'>
            <Select
              defaultValue='all'
              options={[
                { key: 'all', value: 'all', label: 'All Types' },
                ...settings.member_types,
              ]}
              className='w-100'
              dropdownStyle={{ minWidth: 180 }}
              onChange={onChangeSelectedType}
              placeholder='Type'
            />
          </div>
          <div className='mr-md-2 mb-3'>
            <Select
              defaultValue={ClubMemberStatus.PENDING}
              options={[
                ...settings.account_membership_status.filter(
                  (s) =>
                    s.value === ClubMemberStatus.PENDING ||
                    s.value === ClubMemberStatus.REJECTED,
                ),
              ]}
              className='w-100'
              dropdownStyle={{ minWidth: 220 }}
              onChange={onChangeSelectedStatus}
              placeholder='Status'
            />
          </div>
        </Flex>
      </Flex>

      {/* List */}
      <div className='table-responsive'>
        <Table
          rowKey='user_id'
          loading={{
            size: 'large',
            spinning: loading,
            tip: 'Fetching requests...',
          }}
          columns={columns}
          dataSource={requests}
          pagination={{
            responsive: true,
            total,
            current: pagination.page,
            pageSize: pagination.size,
            onChange: onChangePagination,
          }}
        />
      </div>
    </Card>
  );
};

export default ClubRequestList;
