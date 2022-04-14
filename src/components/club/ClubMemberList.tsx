/* eslint-disable */
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
import { AdminSetting, User, UserStatus } from '@/types/user';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getUserStatusTagColor } from '@/utils/user';

// Components
import { Flex, AvatarStatus } from '@/components/shared';
import MemberActionButton, {
  MemberActionButtonProps,
} from '@/components/member/MemberActionButton';

export interface ClubMemberListProps {
  loading: boolean;
  pagination: Pagination;
  total: number;
  members: User[];
  onSearch: ChangeEventHandler<HTMLInputElement>;
  onChangePagination: PaginationProps['onChange'];
  onChangeSelectedType: SelectProps<AdminSetting['id'] | 'all'>['onChange'];
  onChangeSelectedStatus: SelectProps<AdminSetting['id']>['onChange'];
  onRemove: MemberActionButtonProps['onRemove'];
}

const ClubMemberList: FC<ClubMemberListProps> = ({
  loading,
  pagination,
  total,
  members,
  onSearch,
  onChangePagination,
  onChangeSelectedType,
  onChangeSelectedStatus,
  onRemove,
}) => {
  const history = useHistory();
  const { settings } = useGlobal();

  const columns: TableProps<User>['columns'] = [
    {
      key: 'user_id',
      dataIndex: 'user_id',
      title: 'ID',
    },
    {
      key: 'fullname',
      dataIndex: 'fullname',
      title: 'Member',
      render: (fullname: User['fullname'], member) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={member.img_profile}
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
      dataIndex: 'email',
      title: 'Email',
    },
    {
      key: 'created_at',
      dataIndex: 'created_at',
      title: 'Date Created',
      render: (created_at: User['created_at']) =>
        moment(created_at).format('MMMM DD, YYYY'),
    },
    {
      key: 'member_type',
      dataIndex: 'member_type',
      title: 'Member Type',
      render: (member_type: User['member_type']) =>
        settings.member_types.find((t) => t.value === member_type)?.label,
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render: (status: User['status']) => (
        <Tag color={getUserStatusTagColor(status)}>
          {settings.user_status.find((s) => s.value === status)?.label}
        </Tag>
      ),
    },
    {
      key: 'actions',
      render: (member: User) => (
        <div className='text-right'>
          <MemberActionButton member={member} onRemove={onRemove} />
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
              defaultValue={UserStatus.APPROVED}
              options={[
                ...settings.user_status.filter(
                  (s) =>
                    s.value === UserStatus.APPROVED ||
                    s.value === UserStatus.DELETED ||
                    s.value === UserStatus.PENDING_RENEWAL_APPROVAL,
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
            tip: 'Fetching members...',
          }}
          columns={columns}
          dataSource={members}
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

export default ClubMemberList;
/* eslint-enable */
