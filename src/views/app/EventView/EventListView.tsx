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
import moment from 'moment';

// Types
import { Pagination } from '@/types';
import { ResponseData } from '@/types/api';
import { Event } from '@/types/event';
import { AdminSetting } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getEventStatusTagColor } from '@/utils/event';

// Components
import { Flex, AvatarStatus } from '@/components/shared';
import EventActionButton, {
  EventActionButtonProps,
} from '@/components/event/EventActionButton';

interface ListState {
  keyword: string;
  pagination: Pagination;
  total: number;
  events: Event[];
  selectedStatus: AdminSetting['id'] | 'all';
}

const EventListView: FC<RouteComponentProps> = ({ history }) => {
  const { settings } = useGlobal();
  const [loading, setLoading] = useState<boolean>(false);
  const [listState, setListState] = useState<ListState>({
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    events: [],
    selectedStatus: 'all',
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);

      const { keyword, pagination, selectedStatus } = listState;

      const { data } = await API.get<ResponseData<Event[]>>('/event', {
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
          events: {
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
      void fetchEvents();
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
  const handleRemove: EventActionButtonProps['onRemove'] = () => {
    void fetchEvents();
  };

  const columns: TableProps<Event>['columns'] = [
    {
      key: 'event_id',
      dataIndex: 'event_id',
      title: 'ID',
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Event',
      render: (title: Event['title'], event) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={event.image}
            alt={title}
            name={title}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/events/${event.event_id}`,
              })
            }
          />
        </div>
      ),
    },
    {
      key: 'event_date',
      dataIndex: 'event_date',
      title: 'Date',
      render: (date: Event['event_date']) => moment(date).format('YYYY-MM-DD'),
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render: (status: Event['status']) => (
        <Tag color={getEventStatusTagColor(status)}>
          {settings.event_status.find((s) => s.value === status)?.label}
        </Tag>
      ),
    },
    {
      key: 'actions',
      render: (event: Event) => (
        <div className='text-right'>
          <EventActionButton event={event} onRemove={handleRemove} />
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
                ...settings.news_status,
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
                  pathname: `${APP_PREFIX_PATH}/events/add`,
                })
              }
            >
              Add Event
            </Button>
          </div>
        </Flex>
      </Flex>

      {/* List */}
      <div className='table-responsive'>
        <Table
          rowKey='event_id'
          loading={{
            size: 'large',
            spinning: loading,
            tip: 'Fetching events...',
          }}
          columns={columns}
          dataSource={listState.events}
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

export default memo(EventListView);
/* eslint-enable */
