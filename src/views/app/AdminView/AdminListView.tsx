import {
  FC,
  memo,
  useState,
  useEffect,
  useCallback,
  ChangeEventHandler,
} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Card,
  PaginationProps,
  Input,
  Select,
  SelectProps,
  Button,
  Table,
  TableProps,
  Tag,
} from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import moment from 'moment';
import update from 'immutability-helper';

// Types
import { Pagination } from '@/types';
import { ResponseData } from '@/types/api';
import { User, UserRole, AdminSetting } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Constants
import { AdminRoleOptions } from '@/constants/user';

// Custom Hooks
import { useGlobal, useAuth } from '@/hooks';

// Utils
import { getUserRoleLabel, getUserStatusTagColor } from '@/utils/user';

// Components
import { Flex, AvatarStatus } from '@/components/shared';
import AdminActionButton, {
  AdminActionButtonProps,
} from '@/components/admin/AdminActionButton';

interface ListState {
  keyword: string;
  pagination: Pagination;
  total: number;
  admins: User[];
  selectedRole?: UserRole;
  selectedType: AdminSetting['id'] | 'all';
  selectedStatus: AdminSetting['id'] | 'all';
}

const AdminListView: FC<RouteComponentProps> = ({ history }) => {
  const { settings } = useGlobal();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [listState, setListState] = useState<ListState>({
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    admins: [],
    selectedRole: currentUser?.role,
    selectedType: 'all',
    selectedStatus: 'all',
  });

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);

      const {
        keyword,
        pagination,
        selectedRole,
        selectedType,
        selectedStatus,
      } = listState;

      const { data } = await API.get<ResponseData<User[]>>('member/list', {
        params: {
          keyword,
          page: pagination.page,
          size: pagination.size,
          account_id:
            currentUser?.role === UserRole.SUPER_ADMIN
              ? undefined
              : currentUser?.account_id,
          role: selectedRole,
          type: selectedType === 'all' ? undefined : selectedType,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
        },
      });

      setListState(
        update(listState, {
          total: {
            $set: data.total,
          },
          admins: {
            $set: data.data,
          },
        }),
      );

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [listState]);

  useEffect(() => {
    if (
      Object.keys(settings)
        .map((key) => settings[key])
        .every((s) => s.length > 0)
    ) {
      void fetchAdmins();
    }
  }, [
    settings,
    listState.keyword,
    listState.pagination,
    listState.selectedRole,
    listState.selectedType,
    listState.selectedStatus,
  ]);

  const handleSearch = debounce<ChangeEventHandler<HTMLInputElement>>((e) => {
    const { pagination } = listState;

    setListState(
      update(listState, {
        keyword: {
          $set: e.target.value,
        },
        pagination: {
          $set: {
            page: 1,
            size: pagination.size,
          },
        },
      }),
    );
  }, 250);
  const handleChangePagination: PaginationProps['onChange'] = (page, size) => {
    const { pagination } = listState;

    if (pagination.page !== page || pagination.size !== size) {
      setListState(
        update(listState, {
          pagination: {
            $set: {
              page,
              size,
            },
          },
        }),
      );
    }
  };
  const handleChangeSelectedRole: SelectProps<
    ListState['selectedRole']
  >['onChange'] = (newSelectedRole) => {
    setListState(
      update(listState, {
        selectedRole: {
          $set: newSelectedRole,
        },
      }),
    );
  };
  const handleChangeSelectedType: SelectProps<
    ListState['selectedType']
  >['onChange'] = (newSelectedType) => {
    setListState(
      update(listState, {
        selectedType: {
          $set: newSelectedType,
        },
      }),
    );
  };
  const handleChangeSelectedStatus: SelectProps<
    ListState['selectedStatus']
  >['onChange'] = (newSelectedStatus) => {
    setListState(
      update(listState, {
        selectedStatus: {
          $set: newSelectedStatus,
        },
      }),
    );
  };
  const handleRemove: AdminActionButtonProps['onRemove'] = () => {
    void fetchAdmins();
  };

  const columns: TableProps<User>['columns'] = [
    {
      key: 'user_id',
      dataIndex: 'user_id',
      title: 'ID',
    },
    {
      key: 'fullname',
      dataIndex: 'fullname',
      title: 'Admin',
      render: (fullname: User['fullname'], user) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={user.img_profile}
            name={fullname}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/admins/${user.user_id}`,
              })
            }
          />
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      key: 'created_at',
      dataIndex: 'created_at',
      title: 'Date Created',
      render: (created_at: User['created_at']) =>
        moment(created_at).format('MMMM DD, YYYY'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: User['role']) => getUserRoleLabel(role),
    },
    {
      title: 'Member Type',
      dataIndex: 'member_type',
      key: 'member_type',
      render: (member_type: User['member_type']) =>
        settings.member_types.find((t) => t.value === member_type)?.label,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: User['status']) => (
        <Tag color={getUserStatusTagColor(status)}>
          {settings.user_status.find((s) => s.value === status)?.label}
        </Tag>
      ),
    },
    {
      key: 'actions',
      render: (admin: User) => (
        <div className='text-right'>
          <AdminActionButton admin={admin} onRemove={handleRemove} />
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
              onChange={handleSearch}
            />
          </div>
          <div className='mr-md-2 mb-3'>
            <Select
              defaultValue={currentUser?.role}
              options={AdminRoleOptions}
              className='w-100'
              dropdownStyle={{ minWidth: 180 }}
              onChange={handleChangeSelectedRole}
              placeholder='Role'
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
              onChange={handleChangeSelectedType}
              placeholder='Type'
            />
          </div>
          <div className='mr-md-2 mb-3'>
            <Select
              defaultValue='all'
              options={[
                { key: 'all', value: 'all', label: 'All Status' },
                ...settings.user_status,
              ]}
              className='w-100'
              dropdownStyle={{ minWidth: 220 }}
              onChange={handleChangeSelectedStatus}
              placeholder='Status'
            />
          </div>
        </Flex>

        <Flex className='mb-1' mobileFlex={false}>
          <div className='mb-3'>
            <Button
              type='primary'
              icon={<PlusCircleOutlined />}
              block
              onClick={() =>
                history.push({
                  pathname: `${APP_PREFIX_PATH}/admins/add`,
                })
              }
            >
              Add Admin
            </Button>
          </div>
        </Flex>
      </Flex>

      {/* List */}
      <div className='table-responsive'>
        <Table
          loading={{
            size: 'large',
            spinning: loading,
            tip: 'Fetching admins...',
          }}
          columns={columns}
          dataSource={listState.admins}
          rowKey='user_id'
          pagination={{
            responsive: true,
            total: listState.total,
            current: listState.pagination.page,
            pageSize: listState.pagination.size,
            onChange: handleChangePagination,
          }}
        />
      </div>
    </Card>
  );
};

export default memo(AdminListView);
