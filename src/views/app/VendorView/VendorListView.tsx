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
  Spin,
  Pagination as AntPagination,
  Button,
  Table,
  TableProps,
  PaginationProps,
  Tag,
} from 'antd';
import {
  SearchOutlined,
  PlusCircleOutlined,
  CreditCardOutlined,
  SketchOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import update from 'immutability-helper';

// Types
import { Pagination, Option } from '@/types';
import { ResponseData } from '@/types/api';
import { Club } from '@/types/club';
import { Vendor } from '@/types/vendor';
import { AdminSetting } from '@/types/user';
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
import VendorActionButton, {
  VendorActionButtonProps,
} from '@/components/vendor/VendorActionButton';

interface ClubFilter {
  loading: boolean;
  keyword: string;
  pagination: Pagination;
  total: number;
  clubs: Option<Club['account_id']>[];
}

interface ListState {
  keyword: string;
  pagination: Pagination;
  total: number;
  vendors: Vendor[];
  selectedType: AdminSetting['id'] | 'all';
  selectedClub: Club['account_id'] | 'all';
  selectedStatus: AdminSetting['id'] | 'all';
}

const VendorListView: FC<RouteComponentProps> = ({ history, location }) => {
  const { settings } = useGlobal();
  const [loading, setLoading] = useState<boolean>(false);
  const [clubFilter, setClubFilter] = useState<ClubFilter>({
    loading: false,
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    clubs: [],
  });
  const [listState, setListState] = useState<ListState>({
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    vendors: [],
    selectedType: 'all',
    selectedClub: 'all',
    selectedStatus: 'all',
  });

  const fetchClubs = useCallback(async () => {
    try {
      setClubFilter(
        update(clubFilter, {
          loading: {
            $set: true,
          },
        }),
      );

      const { keyword, pagination } = clubFilter;

      const { data } = await API.get<ResponseData<Club[]>>('/account/list', {
        params: {
          keyword,
          page: pagination.page,
          size: pagination.size,
        },
      });

      setClubFilter(
        update(clubFilter, {
          loading: {
            $set: false,
          },
          total: {
            $set: data.total,
          },
          clubs: {
            $set: data.data.map((club) => ({
              key: club.account_id,
              value: club.account_id,
              label: club.company,
            })),
          },
        }),
      );
    } catch (err) {
      setClubFilter(
        update(clubFilter, {
          loading: {
            $set: false,
          },
        }),
      );
    }
  }, [clubFilter]);
  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);

      const {
        keyword,
        pagination,
        selectedType,
        selectedClub,
        selectedStatus,
      } = listState;

      const { data } = await API.get<ResponseData<Vendor[]>>('/vendor/list', {
        params: {
          keyword,
          page: pagination.page,
          size: pagination.size,
          type: selectedType === 'all' ? undefined : selectedType,
          account_id: selectedClub === 'all' ? undefined : selectedClub,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
        },
      });

      setListState(
        update(listState, {
          total: {
            $set: data.total,
          },
          vendors: {
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
    void fetchClubs();
  }, [clubFilter.keyword, clubFilter.pagination]);
  useEffect(() => {
    if (
      Object.keys(settings)
        .map((key) => settings[key])
        .every((s) => s.length > 0)
    ) {
      void fetchVendors();
    }
  }, [
    settings,
    listState.keyword,
    listState.pagination,
    listState.selectedType,
    listState.selectedClub,
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
  const handleSearchClubFilter = debounce<(e: string) => void>((newKeyword) => {
    const { pagination } = listState;

    setClubFilter(
      update(clubFilter, {
        keyword: {
          $set: newKeyword,
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
  const handleChangeClubFilterPagination: PaginationProps['onChange'] = (
    page,
    size,
  ) => {
    const { pagination } = clubFilter;

    if (pagination.page !== page || pagination.size !== size) {
      setClubFilter(
        update(clubFilter, {
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
  const handleChangeSelectedClub: SelectProps<
    ListState['selectedClub']
  >['onChange'] = (newSelectedClub) => {
    setListState(
      update(listState, {
        selectedClub: {
          $set: newSelectedClub,
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
  const handleChangeLevel: VendorActionButtonProps['onRemove'] = () => {
    void fetchVendors();
  };
  const handleRemove: VendorActionButtonProps['onRemove'] = () => {
    void fetchVendors();
  };

  const columns: TableProps<Vendor>['columns'] = [
    {
      key: 'user_id',
      dataIndex: 'user_id',
      title: 'ID',
    },
    {
      key: 'user',
      dataIndex: 'user_id',
      title: 'Member',
      render: (user_id: Vendor['user_id'], vendor) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={vendor.img_profile}
            name={vendor.fullname}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/members/${user_id}`,
                search: `?callback_url=${location.pathname}`,
              })
            }
          />
        </div>
      ),
    },
    {
      key: 'vendor_name',
      dataIndex: 'vendor_name',
      title: 'Vendor',
      render: (vendor_name: Vendor['vendor_name'], vendor) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={vendor.img_vendor}
            name={vendor_name}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/vendors/${vendor.user_id}`,
              })
            }
          />
        </div>
      ),
    },
    {
      key: 'company',
      dataIndex: 'company',
      title: 'Company',
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: 'Email',
    },
    {
      key: 'club',
      dataIndex: 'club',
      title: 'Club',
      render: (club: Vendor['club'], vendor) =>
        club !== null ? (
          <div className='d-flex'>
            <AvatarStatus
              size={60}
              shape='square'
              src={vendor.club_logo}
              name={club.company_full_name}
              onNameClick={() =>
                history.push({
                  pathname: `${APP_PREFIX_PATH}/clubs/${club.account_id}`,
                })
              }
            />
          </div>
        ) : null,
    },
    {
      title: 'Member Type',
      dataIndex: 'member_type',
      key: 'member_type',
      render: (member_type: Vendor['member_type']) =>
        settings.member_types.find((t) => t.value === member_type)?.label,
    },
    {
      key: 'carkee_level',
      dataIndex: 'carkee_level',
      title: 'Level',
      render: (carkee_level: Vendor['carkee_level']) => (
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Vendor['status']) => (
        <Tag color={getUserStatusTagColor(status)}>
          {settings.user_status.find((s) => s.value === status)?.label}
        </Tag>
      ),
    },
    {
      key: 'actions',
      render: (vendor: Vendor) => (
        <div className='text-right'>
          <VendorActionButton
            vendor={vendor}
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
              style={{
                minWidth: 240,
              }}
            />
          </div>

          <div className='mr-md-2 mb-3'>
            <Select
              className='w-100'
              defaultValue='all'
              options={[
                { key: 'all', value: 'all', label: 'All Types' },
                ...settings.member_types,
              ]}
              dropdownStyle={{ minWidth: 240 }}
              style={{
                minWidth: 180,
              }}
              onChange={handleChangeSelectedType}
              placeholder='Type'
            />
          </div>

          <div className='mr-md-2 mb-3'>
            <Select
              className='w-100'
              defaultValue='all'
              loading={clubFilter.loading}
              options={[
                { key: 'all', value: 'all', label: 'All Clubs' },
                ...clubFilter.clubs,
              ]}
              notFoundContent={
                clubFilter.loading ? <p>Fetching clubs...</p> : null
              }
              dropdownRender={(menu) =>
                clubFilter.loading ? (
                  <Flex
                    className='p-2'
                    justifyContent='center'
                    alignItems='center'
                  >
                    <Spin tip='Fetching clubs...' />
                  </Flex>
                ) : (
                  <>
                    {menu}
                    <Flex justifyContent='center' alignItems='center'>
                      <AntPagination
                        className='my-2'
                        simple
                        current={clubFilter.pagination.page}
                        total={clubFilter.total}
                        onChange={handleChangeClubFilterPagination}
                      />
                    </Flex>
                  </>
                )
              }
              dropdownStyle={{ minWidth: 240 }}
              style={{
                minWidth: 180,
              }}
              onChange={handleChangeSelectedClub}
              showSearch
              filterOption={false}
              onSearch={handleSearchClubFilter}
              placeholder='Club'
            />
          </div>

          <div className='mr-md-2 mb-3'>
            <Select
              className='w-100'
              defaultValue='all'
              options={[
                { key: 'all', value: 'all', label: 'All Status' },
                ...settings.user_status,
              ]}
              dropdownStyle={{ minWidth: 240 }}
              style={{
                minWidth: 180,
              }}
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
                  pathname: `${APP_PREFIX_PATH}/vendors/add`,
                })
              }
            >
              Add Vendor
            </Button>
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
            tip: 'Fetching vendors...',
          }}
          columns={columns}
          dataSource={listState.vendors}
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

export default memo(VendorListView);
