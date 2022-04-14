/* eslint-disable */
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
  Table,
  TableProps,
  Tag,
} from 'antd';
import {
  SearchOutlined,
  CreditCardOutlined,
  SketchOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import update from 'immutability-helper';

// Types
import { Pagination } from '@/types';
import { ResponseData } from '@/types/api';
import { AdminSetting, User } from '@/types/user';
import { SponsorLevel } from '@/types/sponsor';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getSponsorLevelColor } from '@/utils/sponsor';
import { getUserStatusTagColor } from '@/utils/user';

// Components
import { Flex, AvatarStatus } from '@/components/shared';
import SponsorActionButton, {
  SponsorActionButtonProps,
} from '@/components/sponsor/SponsorActionButton';

interface ListState {
  keyword: string;
  pagination: Pagination;
  total: number;
  sponsors: User[];
  selectedType: AdminSetting['id'] | 'all';
  selectedStatus: AdminSetting['id'] | 'all';
  selectedLevel: AdminSetting['id'] | 'all';
}

const SponsorListView: FC<RouteComponentProps> = ({ history }) => {
  const { settings } = useGlobal();
  const [loading, setLoading] = useState<boolean>(false);
  const [listState, setListState] = useState<ListState>({
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    sponsors: [],
    selectedType: 'all',
    selectedStatus: 'all',
    selectedLevel: 'all',
  });

  const fetchSponsors = useCallback(async () => {
    try {
      setLoading(true);

      const {
        keyword,
        pagination,
        selectedType,
        selectedStatus,
        selectedLevel,
      } = listState;

      const { data } = await API.get<ResponseData<User[]>>('sponsor/list', {
        params: {
          keyword,
          page: pagination.page,
          size: pagination.size,
          type: selectedType === 'all' ? undefined : selectedType,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
          sponsor_level: selectedLevel === 'all' ? undefined : selectedLevel,
        },
      });

      setListState(
        update(listState, {
          total: {
            $set: data.total,
          },
          sponsors: {
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
      void fetchSponsors();
    }
  }, [
    settings,
    listState.keyword,
    listState.pagination,
    listState.selectedType,
    listState.selectedStatus,
    listState.selectedLevel,
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
  const handleChangeSelectedLevel: SelectProps<
    ListState['selectedLevel']
  >['onChange'] = (newSelectedLevel) => {
    setListState(
      update(listState, {
        selectedLevel: {
          $set: newSelectedLevel,
        },
      }),
    );
  };
  const handleChangeLevel: SponsorActionButtonProps['onRemove'] = () => {
    void fetchSponsors();
  };
  const handleRemove: SponsorActionButtonProps['onRemove'] = () => {
    void fetchSponsors();
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
      title: 'Sponsor',
      render: (fullname: User['fullname'], sponsor) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={sponsor.img_profile}
            alt={fullname}
            name={fullname}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/members/${sponsor.user_id}`,
                search: `?callback_url=${location.pathname}`,
              })
            }
          />
        </div>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      key: 'carkee_level',
      dataIndex: 'carkee_level',
      title: 'Level',
      render: (carkee_level: User['carkee_level']) => (
        <Tag
          color={getSponsorLevelColor(carkee_level)}
          icon={
            carkee_level === SponsorLevel.DIAMOND ? (
              <SketchOutlined />
            ) : (
              <CreditCardOutlined />
            )
          }
        >
          {settings.sponsor_levels.find((s) => s.value === carkee_level)?.label}
        </Tag>
      ),
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
      render: (sponsor: User) => (
        <div className='text-right'>
          <SponsorActionButton
            sponsor={sponsor}
            onChangeLevel={handleChangeLevel}
            onRemove={handleRemove}
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
              onChange={handleSearch}
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
          <div className='mr-md-2 mb-3'>
            <Select
              defaultValue='all'
              options={[
                { key: 'all', value: 'all', label: 'All Levels' },
                ...settings.sponsor_levels,
              ]}
              className='w-100'
              dropdownStyle={{ minWidth: 220 }}
              onChange={handleChangeSelectedLevel}
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
            tip: 'Fetching sponsors...',
          }}
          columns={columns}
          dataSource={listState.sponsors}
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

export default memo(SponsorListView);
/* eslint-enable */
