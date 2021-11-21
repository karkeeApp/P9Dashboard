import { FC, memo, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tooltip, Button, Tabs, TabsProps, notification } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// Types
import { ResponseData } from '@/types/api';
import { User } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useQuery } from '@/hooks';

// Utils
import { setSearchParam } from '@/utils/router';

// Components
import { PageHeaderAlt } from '@/components/layout';
import { Flex, Loading } from '@/components/shared';
import {
  UserGeneralDescription,
  UserVehicleDescription,
  UserEmergencyDescription,
  UserTransferDescription,
  UserSettingsDescription,
} from '@/components/user';

const { TabPane } = Tabs;

const UserDetailsView: FC<RouteComponentProps<{ id: string }>> = ({
  match,
  history,
}) => {
  const { id } = match.params;
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchUser = useCallback<(withLoading?: boolean) => Promise<void>>(
    async (withLoading = true) => {
      try {
        if (withLoading) {
          setLoading(true);
        }

        const { data } = await API.get<ResponseData<User>>(
          '/member/info-by-user-id',
          {
            params: {
              user_id: id,
            },
          },
        );

        setUser(data.data);

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

  useEffect(() => {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      void fetchUser();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/users`,
    });
  }, [id]);

  useEffect(() => {
    const activeTabFromQuery = query.get('tab');

    if (activeTabFromQuery && activeTab !== activeTabFromQuery) {
      setActiveTab(activeTabFromQuery);
      return;
    }

    setSearchParam('tab', 'general');
  }, []);

  // Main Handlers
  const handleChangeTab: TabsProps['onChange'] = (newActiveTab) => {
    setSearchParam('tab', newActiveTab);
    setActiveTab(newActiveTab);
  };
  const handleApprove = async () => {
    try {
      setApproveLoading(true);

      if (user) {
        const approveData: FormData = new FormData();
        approveData.set('user_id', String(user.user_id));

        await API.post('/member/approve', approveData);

        notification.success({
          message: (
            <span>
              Approved user <strong>{user.fullname}</strong>
            </span>
          ),
        });
      }

      setApproveLoading(false);

      void fetchUser(false);
    } catch (err) {
      setApproveLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      setRejectLoading(true);

      if (user) {
        const rejectData: FormData = new FormData();
        rejectData.set('user_id', String(user.user_id));

        await API.post('/member/reject', rejectData);

        notification.success({
          message: (
            <span>
              Rejected user <strong>{user.fullname}</strong>
            </span>
          ),
        });
      }

      setRejectLoading(false);

      void fetchUser(false);
    } catch (error) {
      setRejectLoading(false);
    }
  };

  return !loading && user !== null ? (
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
              <h2 className='mr-2'>{user.fullname}</h2>
              <Tooltip title='Edit' placement='bottom'>
                <Button
                  type='text'
                  icon={<EditOutlined />}
                  onClick={() =>
                    history.push({
                      pathname: `${APP_PREFIX_PATH}/users/edit/${user.user_id}`,
                    })
                  }
                />
              </Tooltip>
            </Flex>
            {user.status === 2 || user.status === 5 || user.status === 6 ? (
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
                  {user.status === 2 ? 'Confirm' : 'Approve'}
                </Button>
              </div>
            ) : null}
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
            <UserGeneralDescription user={user} />
          </TabPane>
          <TabPane key='vehicle' tab='Vehicle'>
            <UserVehicleDescription user={user} />
          </TabPane>
          <TabPane key='emergency' tab='Emergency'>
            <UserEmergencyDescription user={user} />
          </TabPane>
          <TabPane key='transfer' tab='Transfer'>
            <UserTransferDescription user={user} />
          </TabPane>
          <TabPane key='settings' tab='Settings'>
            <UserSettingsDescription user={user} />
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <Loading cover='content' />
  );
};

export default memo(UserDetailsView);
