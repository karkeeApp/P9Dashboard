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
  Tooltip,
  Button,
  Tabs,
  TabsProps,
  PaginationProps,
  SelectProps,
  notification,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import update from 'immutability-helper';

// Types
import { Pagination } from '@/types';
import { ResponseData } from '@/types/api';
import {
  Club,
  ClubSecurityQuestion,
  ClubMember,
  ClubMemberStatus,
} from '@/types/club';
import { AdminSetting, User, UserStatus } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useQuery, useGlobal } from '@/hooks';

// Utils
import { setSearchParam } from '@/utils/router';

// Components
import { PageHeaderAlt } from '@/components/layout';
import { Flex, Loading } from '@/components/shared';
import {
  ClubGeneralDescription,
  ClubSecurityQuestionsDescription,
  ClubMemberList,
  ClubRequestList,
} from '@/components/club';

interface ListState<T> {
  loading: boolean;
  keyword: string;
  pagination: Pagination;
  total: number;
  list: T[];
  selectedType: AdminSetting['id'] | 'all';
  selectedStatus: AdminSetting['id'];
}

const { TabPane } = Tabs;

const ClubDetailsView: FC<RouteComponentProps<{ id: string }>> = ({
  match,
  history,
}) => {
  const { id } = match.params;
  const query = useQuery();
  const { settings } = useGlobal();
  const [loading, setLoading] = useState<boolean>(false);
  const [rejectLoading, setRejectLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [club, setClub] = useState<Club | null>(null);
  const [securityQuestionListState, setSecurityQuestionListState] = useState<
    Partial<ListState<ClubSecurityQuestion>>
  >({
    loading: false,
    list: [],
  });
  const [memberListState, setMemberListState] = useState<ListState<User>>({
    loading: false,
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    list: [],
    selectedType: 'all',
    selectedStatus: UserStatus.APPROVED,
  });
  const [requestListState, setRequestListState] = useState<
    ListState<ClubMember>
  >({
    loading: false,
    keyword: '',
    pagination: {
      page: 1,
      size: 10,
    },
    total: 0,
    list: [],
    selectedType: 'all',
    selectedStatus: ClubMemberStatus.PENDING,
  });
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchClub = useCallback<(withLoading?: boolean) => Promise<void>>(
    async (withLoading?: boolean) => {
      try {
        if (withLoading) {
          setLoading(true);
        }

        const { data } = await API.get<ResponseData<Club>>('/account/view', {
          params: {
            account_id: id,
          },
        });

        setClub(data.data);

        if (withLoading) {
          setLoading(false);
        }
      } catch (err) {
        if (withLoading) {
          setLoading(false);
        }
      }
    },
    [id],
  );
  const fetchSecurityQuestions = useCallback(async () => {
    try {
      setSecurityQuestionListState(
        update(securityQuestionListState, {
          loading: {
            $set: true,
          },
        }),
      );

      const { data } = await API.get<ResponseData<ClubSecurityQuestion[]>>(
        '/account/list-security-questions',
        {
          params: {
            account_id: id,
          },
        },
      );

      setSecurityQuestionListState(
        update(securityQuestionListState, {
          loading: {
            $set: false,
          },
          list: {
            $set: data.data,
          },
        }),
      );

      setLoading(false);
    } catch (err) {
      setSecurityQuestionListState(
        update(securityQuestionListState, {
          loading: {
            $set: false,
          },
        }),
      );
    }
  }, [id, securityQuestionListState]);
  const fetchMembers = useCallback(async () => {
    try {
      setMemberListState(
        update(memberListState, {
          loading: {
            $set: true,
          },
        }),
      );

      const { keyword, pagination, selectedType, selectedStatus } =
        memberListState;

      const { data } = await API.get<ResponseData<User[]>>('/member/list', {
        params: {
          account_id: id,
          keyword,
          page: pagination.page,
          size: pagination.size,
          type: selectedType === 'all' ? undefined : selectedType,
          status: selectedStatus,
        },
      });

      setMemberListState(
        update(memberListState, {
          loading: {
            $set: false,
          },
          total: {
            $set: data.total,
          },
          list: {
            $set: data.data,
          },
        }),
      );
    } catch (err) {
      setMemberListState(
        update(memberListState, {
          loading: {
            $set: false,
          },
        }),
      );
    }
  }, [id, memberListState]);
  const fetchRequests = useCallback(async () => {
    try {
      setRequestListState(
        update(requestListState, {
          loading: {
            $set: true,
          },
        }),
      );

      const { keyword, pagination, selectedType, selectedStatus } =
        requestListState;

      const { data } = await API.get<ResponseData<ClubMember[]>>(
        '/account/list-account-membership',
        {
          params: {
            account_id: id,
            keyword,
            page: pagination.page,
            size: pagination.size,
            type: selectedType === 'all' ? undefined : selectedType,
            status: selectedStatus,
          },
        },
      );

      setRequestListState(
        update(requestListState, {
          loading: {
            $set: false,
          },
          total: {
            $set: data.total,
          },
          list: {
            $set: data.data,
          },
        }),
      );
    } catch (err) {
      setRequestListState(
        update(requestListState, {
          loading: {
            $set: false,
          },
        }),
      );
    }
  }, [id, requestListState]);

  useEffect(() => {
    const activeTabFromQuery = query.get('tab');

    if (activeTabFromQuery && activeTab !== activeTabFromQuery) {
      setActiveTab(activeTabFromQuery);
      return;
    }

    setSearchParam('tab', 'general');
  }, []);
  useEffect(() => {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      void fetchClub();
      void fetchSecurityQuestions();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/clubs`,
    });
  }, [id]);
  useEffect(() => {
    if (
      Object.keys(settings)
        .map((key) => settings[key])
        .every((s) => s.length > 0)
    ) {
      void fetchMembers();
    }
  }, [
    id,
    settings,
    memberListState.keyword,
    memberListState.pagination,
    memberListState.selectedType,
    memberListState.selectedStatus,
  ]);
  useEffect(() => {
    if (
      Object.keys(settings)
        .map((key) => settings[key])
        .every((s) => s.length > 0)
    ) {
      void fetchRequests();
    }
  }, [
    id,
    settings,
    requestListState.keyword,
    requestListState.pagination,
    requestListState.selectedType,
    requestListState.selectedStatus,
  ]);

  /**
   *
   * Main Handlers
   *
   */
  const handleChangeTab: TabsProps['onChange'] = (newActiveTab) => {
    setSearchParam('tab', newActiveTab);
    setActiveTab(newActiveTab);
  };
  const handleApprove = async () => {
    try {
      setApproveLoading(true);

      if (club) {
        const approveData: FormData = new FormData();
        approveData.set('account_id', String(club.account_id));

        await API.post('/account/approve', approveData);

        notification.success({
          message: (
            <span>
              Approved club <strong>{club.company}</strong>
            </span>
          ),
        });
      }

      setApproveLoading(false);

      void fetchClub(false);
    } catch (err) {
      setApproveLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      setRejectLoading(true);

      if (club) {
        const rejectData: FormData = new FormData();
        rejectData.set('account_id', String(club.account_id));

        await API.post('/account/reject', rejectData);

        notification.success({
          message: (
            <span>
              Rejected club <strong>{club.company}</strong>
            </span>
          ),
        });
      }

      setRejectLoading(false);

      void fetchClub(false);
    } catch (err) {
      setRejectLoading(false);
    }
  };

  /**
   *
   * Member Handlers
   *
   */
  const handleSearchMembers = debounce<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const { pagination } = memberListState;

      setMemberListState(
        update(memberListState, {
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
    },
    250,
  );
  const handleChangeMemberListPagination: PaginationProps['onChange'] = (
    page,
    size,
  ) => {
    const { pagination } = memberListState;

    if (pagination.page !== page || pagination.size !== size) {
      setMemberListState(
        update(memberListState, {
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
  const handleChangeSelectedMemberType: SelectProps<
    ListState<User>['selectedType']
  >['onChange'] = (newSelectedMemberType) => {
    setMemberListState(
      update(memberListState, {
        selectedType: {
          $set: newSelectedMemberType,
        },
      }),
    );
  };
  const handleChangeSelectedMemberStatus: SelectProps<
    ListState<User>['selectedStatus']
  >['onChange'] = (newSelectedMemberStatus) => {
    setMemberListState(
      update(memberListState, {
        selectedStatus: {
          $set: newSelectedMemberStatus,
        },
      }),
    );
  };
  const handleRemoveMember = () => {
    void fetchMembers();
  };

  /**
   *
   * Request Handlers
   *
   */
  const handleSearchRequests = debounce<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const { pagination } = requestListState;

      setRequestListState(
        update(requestListState, {
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
    },
    250,
  );
  const handleChangeRequestListPagination: PaginationProps['onChange'] = (
    page,
    size,
  ) => {
    const { pagination } = requestListState;

    if (pagination.page !== page || pagination.size !== size) {
      setRequestListState(
        update(requestListState, {
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
  const handleChangeSelectedRequestType: SelectProps<
    ListState<ClubMember>['selectedType']
  >['onChange'] = (newSelectedRequestType) => {
    setRequestListState(
      update(requestListState, {
        selectedType: {
          $set: newSelectedRequestType,
        },
      }),
    );
  };
  const handleChangeSelectedRequestStatus: SelectProps<
    ListState<ClubMember>['selectedStatus']
  >['onChange'] = (newSelectedRequestStatus) => {
    setRequestListState(
      update(requestListState, {
        selectedStatus: {
          $set: newSelectedRequestStatus,
        },
      }),
    );
  };
  const handleApproveRequest = () => {
    void fetchMembers();
    void fetchRequests();
  };
  const handleRejectRequest = () => {
    void fetchMembers();
    void fetchRequests();
  };

  return !loading && club !== null ? (
    <>
      <PageHeaderAlt className='border-bottom' overlap>
        <div className='container'>
          <Flex
            className='py-2'
            mobileFlex={false}
            justifyContent='between'
            alignItems='center'
          >
            <Flex
              className='mb-3'
              justifyContent='between'
              alignItems='baseline'
            >
              <h2 className='mr-2'>{club.company}</h2>
              <Tooltip title='Edit' placement='bottom'>
                <Button
                  type='text'
                  icon={<EditOutlined />}
                  onClick={() =>
                    history.push({
                      pathname: `${APP_PREFIX_PATH}/clubs/edit/${club.account_id}`,
                    })
                  }
                />
              </Tooltip>
            </Flex>
            {club.status === 1 && (
              <div className='mb-3'>
                <Button
                  className='mr-2'
                  type='text'
                  danger
                  loading={rejectLoading}
                  disabled={approveLoading}
                  onClick={handleReject}
                >
                  Reject
                </Button>
                <Button
                  type='primary'
                  loading={approveLoading}
                  disabled={rejectLoading}
                  onClick={handleApprove}
                >
                  Approve
                </Button>
              </div>
            )}
          </Flex>
        </div>
      </PageHeaderAlt>

      <div className='container'>
        <Tabs
          activeKey={activeTab}
          onChange={handleChangeTab}
          style={{ marginTop: 30 }}
        >
          <TabPane key='general' tab='General'>
            <ClubGeneralDescription club={club} />
          </TabPane>
          <TabPane key='security-questions' tab='Security Questions'>
            <ClubSecurityQuestionsDescription
              club={club}
              securityQuestions={
                securityQuestionListState.list
                  ? securityQuestionListState.list
                  : []
              }
            />
          </TabPane>
          <TabPane key='members' tab='Members'>
            <ClubMemberList
              loading={memberListState.loading}
              pagination={memberListState.pagination}
              total={memberListState.total}
              members={memberListState.list}
              onSearch={handleSearchMembers}
              onChangePagination={handleChangeMemberListPagination}
              onChangeSelectedType={handleChangeSelectedMemberType}
              onChangeSelectedStatus={handleChangeSelectedMemberStatus}
              onRemove={handleRemoveMember}
            />
          </TabPane>
          <TabPane key='requests' tab='Requests'>
            <ClubRequestList
              loading={requestListState.loading}
              pagination={requestListState.pagination}
              total={requestListState.total}
              requests={requestListState.list}
              onSearch={handleSearchRequests}
              onChangePagination={handleChangeRequestListPagination}
              onChangeSelectedType={handleChangeSelectedRequestType}
              onChangeSelectedStatus={handleChangeSelectedRequestStatus}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
            />
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <Loading cover='content' />
  );
};

export default memo(ClubDetailsView);
