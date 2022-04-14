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
  Space,
  Tag,
} from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import update from 'immutability-helper';

// Types
import { Pagination } from '@/types';
import { ResponseData } from '@/types/api';
import { News } from '@/types/news';
import { AdminSetting } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Constants
import { NewsCategoryKeys, NewsTypeOptions } from '@/constants/news';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getNewsStatusTagColor } from '@/utils/news';

// Components
import { Flex, AvatarStatus } from '@/components/shared';
import NewsActionButton, {
  NewsActionButtonProps,
} from '@/components/news/NewsActionButton';

interface ListState {
  keyword: string;
  pagination: Pagination;
  total: number;
  news: News[];
  selectedCategory: AdminSetting['id'] | 'all';
  selectedType: number | 'all';
  selectedStatus: AdminSetting['id'] | 'all';
}

const NewsListView: FC<RouteComponentProps> = ({ history }) => {
  const { settings } = useGlobal();
  const [loading, setLoading] = useState<boolean>(false);
  const [listState, setListState] = useState<ListState>({
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    news: [],
    selectedCategory: 'all',
    selectedType: 'all',
    selectedStatus: 'all',
  });

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);

      const {
        keyword,
        pagination,
        selectedCategory,
        selectedType,
        selectedStatus,
      } = listState;

      const { data } = await API.get<ResponseData<News[]>>('/news', {
        params: {
          keyword,
          page: pagination.page,
          size: pagination.size,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          type: selectedType === 'all' ? undefined : selectedType,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
        },
      });

      setListState(
        update(listState, {
          total: {
            $set: data.total,
          },
          news: {
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
      void fetchNews();
    }
  }, [
    settings,
    listState.keyword,
    listState.pagination,
    listState.selectedCategory,
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
  const handleChangeSelectedCategory: SelectProps<
    ListState['selectedCategory']
  >['onChange'] = (newSelectedCategory) => {
    setListState(
      update(listState, {
        selectedCategory: {
          $set: newSelectedCategory,
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
  const handleRemove: NewsActionButtonProps['onRemove'] = () => {
    void fetchNews();
  };

  const columns: TableProps<News>['columns'] = [
    {
      key: 'news_id',
      dataIndex: 'news_id',
      title: 'ID',
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'News',
      render: (title: News['title'], { news_id, image }) => (
        <div className='d-flex'>
          <AvatarStatus
            size={60}
            shape='square'
            src={image}
            name={title}
            onNameClick={() =>
              history.push({
                pathname: `${APP_PREFIX_PATH}/news/${news_id}`,
              })
            }
          />
        </div>
      ),
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
    },
    {
      key: 'category',
      title: 'Category',
      align: 'left',
      render: (news: News) => (
        <Space size={[4, 8]} wrap>
          {NewsCategoryKeys.map((category) =>
            news[category] ? (
              <Tag key={category} color='blue'>
                {
                  settings.news_categories.find(
                    (c) => c.value === news[category],
                  )?.label
                }
              </Tag>
            ) : null,
          )}
        </Space>
      ),
    },
    {
      key: 'is_public',
      dataIndex: 'is_public',
      title: 'Type',
      render: (is_public: News['is_public']) =>
        is_public ? 'Public' : 'Private',
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render: (status: News['status']) => (
        <Tag color={getNewsStatusTagColor(status)}>
          {settings.news_status.find((s) => s.value === status)?.label}
        </Tag>
      ),
    },
    {
      key: 'actions',
      render: (newsItem: News) => (
        <div className='text-right'>
          <NewsActionButton news={newsItem} onRemove={handleRemove} />
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
                { key: 'all', value: 'all', label: 'All Categories' },
                ...settings.news_categories,
              ]}
              className='w-100'
              dropdownStyle={{ minWidth: 180 }}
              onChange={handleChangeSelectedCategory}
              placeholder='Category'
            />
          </div>
          <div className='mr-md-2 mb-3'>
            <Select
              defaultValue='all'
              options={[
                { key: 'all', value: 'all', label: 'All Types' },
                ...NewsTypeOptions,
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
                  pathname: `${APP_PREFIX_PATH}/news/add`,
                })
              }
            >
              Adds
            </Button>
          </div>
        </Flex>
      </Flex>

      {/* List */}
      <div className='table-responsive'>
        <Table
          rowKey='news_id'
          loading={{
            size: 'large',
            spinning: loading,
            tip: 'Fetching news...',
          }}
          columns={columns}
          dataSource={listState.news}
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

export default memo(NewsListView);
/* eslint-enable */
