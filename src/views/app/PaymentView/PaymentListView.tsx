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
  Image,
  Skeleton,
  Tag,
} from 'antd';
import {
  SearchOutlined,
  PlusCircleOutlined,
  EyeOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import update from 'immutability-helper';

// Types
import { Pagination } from '@/types';
import { ResponseData } from '@/types/api';
import { Payment } from '@/types/payment';
import { AdminSetting } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getPaymentStatusTagColor } from '@/utils/payment';

// Components
import { Flex, AvatarStatus } from '@/components/shared';
import PaymentActionButton, {
  PaymentActionButtonProps,
} from '@/components/payment/PaymentActionButton';

interface ListState {
  keyword: string;
  pagination: Pagination;
  total: number;
  payments: Payment[];
  selectedStatus: AdminSetting['id'] | 'all';
}

const PaymentListView: FC<RouteComponentProps> = ({ history }) => {
  const { settings } = useGlobal();
  const [loading, setLoading] = useState<boolean>(false);
  const [listState, setListState] = useState<ListState>({
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    payments: [],
    selectedStatus: 'all',
  });

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);

      const { keyword, pagination, selectedStatus } = listState;

      const { data } = await API.get<ResponseData<Payment[]>>(
        '/userpayment/list',
        {
          params: {
            keyword,
            page: pagination.page,
            size: pagination.size,
            status: selectedStatus === 'all' ? undefined : selectedStatus,
          },
        },
      );

      setListState(
        update(listState, {
          total: {
            $set: data.total,
          },
          payments: {
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
      void fetchPayments();
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
  const handleRemove: PaymentActionButtonProps['onRemove'] = () => {
    void fetchPayments();
  };
  const handleStatusUpdate: PaymentActionButtonProps['onStatusUpdate'] = () => {
    void fetchPayments();
  };

  // Column Handlers
  const renderLogCardColumn = (payment: Payment) => {
    if (payment.log_card) {
      switch (payment.log_card_mime_type) {
        case 'application/pdf':
          return (
            <Button
              type='link'
              href={payment.log_card}
              target='_blank'
              style={{
                width: 60,
                height: 60,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FilePdfOutlined
                style={{
                  fontSize: 40,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </Button>
          );

        default:
          return (
            <Image
              width={60}
              height={60}
              src={payment.log_card}
              preview={{
                mask: <EyeOutlined />,
              }}
            />
          );
      }
    }

    return <Skeleton.Image style={{ width: 60, height: 60 }} />;
  };

  const columns: TableProps<Payment>['columns'] = [
    {
      key: 'id',
      dataIndex: 'id',
      title: 'ID',
    },
    {
      key: 'user',
      dataIndex: 'user',
      title: 'User',
      render: (user: Payment['user']) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={user.img_profile}
            name={user.fullname}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/members/${user.user_id}`,
              })
            }
          />
        </div>
      ),
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Payment',
      render: (name: Payment['name'], payment) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={payment.link}
            name={name}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/payments/${payment.id}`,
              })
            }
          />
        </div>
      ),
    },
    {
      key: 'img_log_card',
      dataIndex: 'user',
      title: 'Log Card',
      render: (payment: Payment) => renderLogCardColumn(payment),
    },
    {
      key: 'amount',
      dataIndex: 'amount',
      title: 'Amount',
      render: (amount: Payment['amount']) => `S$ ${amount}`,
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Description',
    },
    {
      key: 'payment_for',
      dataIndex: 'payment_for',
      title: 'Payment For',
      render: (payment_for: Payment['payment_for']) =>
        settings.payment_for.find((s) => s.value === payment_for)?.label,
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render: (status: Payment['status']) => (
        <Tag color={getPaymentStatusTagColor(status)}>
          {settings.payment_status.find((s) => s.value === status)?.label}
        </Tag>
      ),
    },
    {
      key: 'actions',
      render: (payment: Payment) => (
        <div className='text-right'>
          <PaymentActionButton
            payment={payment}
            onRemove={handleRemove}
            onStatusUpdate={handleStatusUpdate}
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
                ...settings.payment_status,
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
                  pathname: `${APP_PREFIX_PATH}/payments/add`,
                })
              }
            >
              Add Payment
            </Button>
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
            tip: 'Fetching payments...',
          }}
          columns={columns}
          dataSource={listState.payments}
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

export default memo(PaymentListView);
