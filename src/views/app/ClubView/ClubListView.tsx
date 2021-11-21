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
import update from 'immutability-helper';

// Types
import { Pagination } from '@/types';
import { ResponseData } from '@/types/api';
import { AdminSetting } from '@/types/user';
import { Club } from '@/types/club';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getClubStatusTagColor } from '@/utils/club';

// Components
import { Flex, AvatarStatus } from '@/components/shared';
import ClubActionButton, {
  ClubActionButtonProps,
} from '@/components/club/ClubActionButton';

interface ListState {
  keyword: string;
  pagination: Pagination;
  total: number;
  clubs: Club[];
  selectedStatus: AdminSetting['id'] | 'all';
}

const ClubListView: FC<RouteComponentProps> = ({ history }) => {
  const { settings } = useGlobal();
  const [loading, setLoading] = useState<boolean>(false);
  const [listState, setListState] = useState<ListState>({
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    clubs: [],
    selectedStatus: 'all',
  });

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);

      const { keyword, pagination, selectedStatus } = listState;

      const { data } = await API.get<ResponseData<Club[]>>('/account/list', {
        params: {
          keyword,
          page: pagination.page,
          size: pagination.size,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
        },
      });

      setListState(
        update(listState, {
          total: {
            $set: data.total,
          },
          clubs: {
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
      void fetchClubs();
    }
  }, [
    settings,
    listState.keyword,
    listState.pagination,
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
  const handleRemove: ClubActionButtonProps['onRemove'] = () => {
    void fetchClubs();
  };

  const columns: TableProps<Club>['columns'] = [
    {
      key: 'id',
      dataIndex: 'account_id',
      title: 'ID',
    },
    {
      key: 'company',
      dataIndex: 'company',
      title: 'Company',
      render: (company: Club['company'], club) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={club.logo_url}
            name={company}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/clubs/${club.account_id}`,
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
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render: (status: Club['status']) => (
        <Tag color={getClubStatusTagColor(status)}>
          {settings.club_status.find((s) => s.value === status)?.label}
        </Tag>
      ),
    },
    {
      key: 'actions',
      render: (club: Club) => (
        <div className='text-right'>
          <ClubActionButton club={club} onRemove={handleRemove} />
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
              defaultValue='all'
              options={[
                { key: 'all', value: 'all', label: 'All Status' },
                ...settings.club_status,
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
                  pathname: `${APP_PREFIX_PATH}/clubs/add`,
                })
              }
            >
              Add Club
            </Button>
          </div>
        </Flex>
      </Flex>

      {/* List */}
      <div className='table-responsive'>
        <Table
          rowKey='account_id'
          loading={{
            size: 'large',
            spinning: loading,
            tip: 'Fetching clubs...',
          }}
          columns={columns}
          dataSource={listState.clubs}
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

export default memo(ClubListView);
