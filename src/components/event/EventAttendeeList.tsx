import {
  FC,
  useState,
  useEffect,
  useCallback,
  ChangeEventHandler,
} from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Input, Table, TableProps, PaginationProps, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import update from 'immutability-helper';

// Types
import { Pagination } from '@/types';
import { ResponseData } from '@/types/api';
import { Event, EventAttendee } from '@/types/event';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getEventAttendeeStatusTagColor } from '@/utils/event';

// Components
import { Flex, AvatarStatus } from '@/components/shared';
import EventAttendeeActionButton, {
  EventAttendeeActionButtonProps,
} from './EventAttendeeActionButton';

export interface EventAttendeeListProps {
  event: Event;
}

interface ListState {
  keyword: string;
  pagination: Pagination;
  total: number;
  attendees: EventAttendee[];
}

const EventAttendeeList: FC<EventAttendeeListProps> = ({ event }) => {
  const history = useHistory();
  const { settings } = useGlobal();
  const [loading, setLoading] = useState<boolean>(false);
  const [listState, setListState] = useState<ListState>({
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    attendees: [],
  });

  const fetchAttendees = useCallback(async () => {
    try {
      setLoading(true);

      const { keyword, pagination } = listState;

      const { data } = await API.get<ResponseData<EventAttendee[]>>(
        '/event/attendees',
        {
          params: {
            event_id: event.event_id,
            keyword,
            page: pagination.page,
            size: pagination.size,
          },
        },
      );

      setListState(
        update(listState, {
          total: {
            $set: data.total,
          },
          attendees: {
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
    void fetchAttendees();
  }, [listState.keyword, listState.pagination]);

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
  const handleFinishConfirm: EventAttendeeActionButtonProps['onFinishConfirm'] =
    () => {
      void fetchAttendees();
    };
  const handleFinishCancel: EventAttendeeActionButtonProps['onFinishCancel'] =
    () => {
      void fetchAttendees();
    };

  const columns: TableProps<EventAttendee>['columns'] = [
    {
      key: 'id',
      dataIndex: 'id',
      title: 'ID',
    },
    {
      key: 'attendee',
      dataIndex: 'user',
      title: 'Attendee',
      render: (user: EventAttendee['user']) => {
        const { img_profile, fullname, user_id } = user;

        return (
          <div className='d-flex'>
            <AvatarStatus
              size={60}
              shape='square'
              src={img_profile}
              alt={fullname}
              name={fullname}
              onNameClick={() =>
                history.push({
                  pathname: `${APP_PREFIX_PATH}/members/${user_id}`,
                })
              }
            />
          </div>
        );
      },
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render: (status: EventAttendee['status']) => (
        <Tag color={getEventAttendeeStatusTagColor(status)}>
          {settings.attendee_status.find((s) => s.value === status)?.label}
        </Tag>
      ),
    },
    {
      key: 'action',
      render: (attendee: EventAttendee) => (
        <div className='text-right'>
          <EventAttendeeActionButton
            attendee={attendee}
            onFinishConfirm={handleFinishConfirm}
            onFinishCancel={handleFinishCancel}
          />
        </div>
      ),
    },
  ];

  return (
    <Card title='Event Attendees'>
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
        </Flex>
      </Flex>

      {/* List */}
      <div className='table-responsive'>
        <Table
          rowKey='id'
          loading={{
            size: 'large',
            spinning: loading,
            tip: 'Fetching attendees...',
          }}
          columns={columns}
          dataSource={listState.attendees}
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

export default EventAttendeeList;
