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
import { Listing } from '@/types/listing';
import { AdminSetting } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getListingStatusTagColor } from '@/utils/listing';

// Components
import { Flex, AvatarStatus } from '@/components/shared';
import ListingActionButton, {
  ListingActionButtonProps,
} from '@/components/listing/ListingActionButton';

interface ListState {
  keyword: string;
  pagination: Pagination;
  total: number;
  listings: Listing[];
  selectedStatus: AdminSetting['id'] | 'all';
}

const ListingListView: FC<RouteComponentProps> = ({ history }) => {
  const { settings } = useGlobal();
  const [loading, setLoading] = useState<boolean>(false);
  const [listState, setListState] = useState<ListState>({
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    listings: [],
    selectedStatus: 'all',
  });

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);

      const { keyword, pagination, selectedStatus } = listState;

      const { data } = await API.get<ResponseData<Listing[]>>('/listing/list', {
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
          listings: {
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
      void fetchListings();
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
  const handleRemove: ListingActionButtonProps['onRemove'] = () => {
    void fetchListings();
  };
  const handleApprove: ListingActionButtonProps['onApprove'] = () => {
    void fetchListings();
  };
  const handleReject: ListingActionButtonProps['onReject'] = () => {
    void fetchListings();
  };

  const columns: TableProps<Listing>['columns'] = [
    {
      key: 'listing_id',
      dataIndex: 'listing_id',
      title: 'ID',
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Listing',
      render: (title: Listing['title'], listing) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={listing.image}
            alt={title}
            name={title}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/listings/${listing.listing_id}`,
              })
            }
          />
        </div>
      ),
    },
    {
      key: 'content',
      dataIndex: 'content',
      title: 'Content',
      width: '40%',
    },
    {
      key: 'vendor_info',
      dataIndex: ['vendor_info', 'vendor_name'],
      title: 'Vendor',
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render: (status: Listing['status']) => (
        <Tag color={getListingStatusTagColor(status)}>
          {settings.listing_status.find((s) => s.value === status)?.label}
        </Tag>
      ),
    },
    {
      key: 'actions',
      render: (listing: Listing) => (
        <div className='text-right'>
          <ListingActionButton
            listing={listing}
            onRemove={handleRemove}
            onApprove={handleApprove}
            onReject={handleReject}
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
                { key: 'all', value: 'all', label: 'All Status' },
                ...settings.listing_status,
              ]}
              className='w-100'
              dropdownStyle={{ minWidth: 180 }}
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
                  pathname: `${APP_PREFIX_PATH}/listings/add`,
                })
              }
            >
              Add Listing
            </Button>
          </div>
        </Flex>
      </Flex>

      {/* List */}
      <div className='table-responsive'>
        <Table
          rowKey='listing_id'
          loading={{
            size: 'large',
            spinning: loading,
            tip: 'Fetching listings...',
          }}
          columns={columns}
          dataSource={listState.listings}
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

export default memo(ListingListView);
/* eslint-enable */
