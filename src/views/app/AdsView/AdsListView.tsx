import {
  FC,
  memo,
  useEffect,
  useState,
  useCallback,
  ChangeEventHandler,
} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Card,
  Input,
  Select,
  SelectProps,
  Button,
  Table,
  TableProps,
  PaginationProps,
  Tag,
} from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import update from 'immutability-helper';

// Types
import { Pagination } from '@/types';
import { ResponseData } from '@/types/api';
import { Ads } from '@/types/ads';
import { AdminSetting } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getAdsStatusTagColor } from '@/utils/ads';

// Components
import { Flex, AvatarStatus } from '@/components/shared';
import { AdsStateSwitcher } from '@/components/ads';
import AdsActionButton, {
  AdsActionButtonProps,
} from '@/components/ads/AdsActionButton';
import AdsIsBottomSetter, {
  AddIsBottomSetterProps,
} from '@/components/ads/AdsIsBottomSetter';

interface ListState {
  keyword: string;
  pagination: Pagination;
  total: number;
  ads: Ads[];
  selectedStatus: AdminSetting['id'] | 'all';
  selectedState: AdminSetting['id'] | 'all';
}

const AdsListView: FC<RouteComponentProps> = ({ history }) => {
  const { settings } = useGlobal();
  const [loading, setLoading] = useState<boolean>(false);
  const [listState, setListState] = useState<ListState>({
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    ads: [],
    selectedStatus: 'all',
    selectedState: 'all',
  });

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);

      const { keyword, pagination, selectedStatus, selectedState } = listState;

      const { data } = await API.get<ResponseData<Ads[]>>('/ads', {
        params: {
          keyword,
          page: pagination.page,
          size: pagination.size,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
          state: selectedState === 'all' ? undefined : selectedState,
        },
      });

      setListState(
        update(listState, {
          total: {
            $set: data.total,
          },
          ads: {
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
      void fetchAds();
    }
  }, [
    settings,
    listState.keyword,
    listState.pagination,
    listState.selectedStatus,
    listState.selectedState,
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
  const handleChangeSelectedState: SelectProps<
    ListState['selectedState']
  >['onChange'] = (newSelectedState) => {
    setListState(
      update(listState, {
        selectedState: {
          $set: newSelectedState,
        },
      }),
    );
  };
  const handleFinishSetIsBottom: AddIsBottomSetterProps['onFinishSetIsBottom'] =
    () => {
      void fetchAds();
    };
  const handleRemove: AdsActionButtonProps['onRemove'] = () => {
    void fetchAds();
  };

  const columns: TableProps<Ads>['columns'] = [
    {
      key: 'ads_id',
      dataIndex: 'ads_id',
      title: 'ID',
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Ads',
      render: (title: Ads['title'], { ads_id, file }) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={file}
            name={title}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/ads/${ads_id}`,
              })
            }
          />
        </div>
      ),
    },
    {
      key: 'summary',
      dataIndex: 'summary',
      title: 'Summary',
      width: '45%',
    },
    {
      key: 'is_bottom',
      dataIndex: 'is_bottom',
      title: 'Is Bottom',
      render: (_, ads) => (
        <AdsIsBottomSetter
          ads={ads}
          onFinishSetIsBottom={handleFinishSetIsBottom}
        />
      ),
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render: (status: Ads['status']) => (
        <Tag color={getAdsStatusTagColor(status)}>
          {settings.ads_status.find((s) => s.value === status)?.label}
        </Tag>
      ),
    },
    {
      key: 'enable_ads',
      dataIndex: 'enable_ads',
      title: 'State',
      render: (_, ads) => <AdsStateSwitcher ads={ads} />,
    },
    {
      key: 'actions',
      render: (ads: Ads) => (
        <div className='text-right'>
          <AdsActionButton ads={ads} onRemove={handleRemove} />
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
                ...settings.ads_status,
              ]}
              className='w-100'
              dropdownStyle={{ minWidth: 180 }}
              onChange={handleChangeSelectedStatus}
              placeholder='Status'
            />
          </div>
          <div className='mr-md-2 mb-3'>
            <Select
              defaultValue='all'
              options={[
                { key: 'all', value: 'all', label: 'All States' },
                ...settings.ads_states,
              ]}
              className='w-100'
              dropdownStyle={{ minWidth: 180 }}
              onChange={handleChangeSelectedState}
              placeholder='State'
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
                  pathname: `${APP_PREFIX_PATH}/ads/add`,
                })
              }
            >
              Add Ads
            </Button>
          </div>
        </Flex>
      </Flex>

      {/* List */}
      <div className='table-responsive'>
        <Table
          rowKey='ads_id'
          loading={{
            size: 'large',
            spinning: loading,
            tip: 'Fetching ads...',
          }}
          columns={columns}
          dataSource={listState.ads}
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

export default memo(AdsListView);
