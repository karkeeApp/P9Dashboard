/* eslint-disable */
import { FC, memo, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tooltip, Button, Tabs, TabsProps, notification } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// Types
import { ResponseData } from '@/types/api';
import { User, UserStatus } from '@/types/user';

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
  MemberGeneralDescription,
  MemberVehicleDescription,
  MemberEmergencyDescription,
  MemberTransferDescription,
  MemberSettingsDescription,
} from '@/components/member';

const { TabPane } = Tabs;

const MemberDetailsView: FC<RouteComponentProps<{ id: string }>> = ({
  match,
  history,
}) => {
  const { id } = match.params;
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [member, setMember] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchMember = useCallback<(withLoading?: boolean) => Promise<void>>(
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

        setMember(data.data);

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
      void fetchMember();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/members`,
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
  const handleEdit = () => {
    const callbackURL = query.get('callback_url');

    if (member) {
      history.push({
        pathname: `${APP_PREFIX_PATH}/members/edit/${member.user_id}`,
        search: callbackURL ? `?callback_url=${callbackURL}` : undefined,
      });
    }
  };
  const handleApprove = async () => {
    try {
      setApproveLoading(true);

      if (member) {
        const approveData: FormData = new FormData();
        approveData.set('user_id', String(member.user_id));

        await API.post('/member/approve', approveData);

        notification.success({
          message: (
            <span>
              Approved user <strong>{member.fullname}</strong>
            </span>
          ),
        });
      }

      setApproveLoading(false);

      void fetchMember(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/members`,
      });
    } catch (err) {
      setApproveLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      setRejectLoading(true);

      if (member) {
        const rejectData: FormData = new FormData();
        rejectData.set('user_id', String(member.user_id));

        await API.post('/member/reject', rejectData);

        notification.success({
          message: (
            <span>
              Rejected user <strong>{member.fullname}</strong>
            </span>
          ),
        });
      }

      setRejectLoading(false);

      void fetchMember(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/members`,
      });
    } catch (error) {
      setRejectLoading(false);
    }
  };

  return !loading && member !== null ? (
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
              <h2 className='mr-2'>{member.fullname}</h2>
              <Tooltip title='Edit' placement='bottom'>
                <Button
                  type='text'
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                />
              </Tooltip>
            </Flex>

            {member.status === UserStatus.PENDING_CONFIRMATION ||
            member.status === UserStatus.PENDING_RENEWAL_APPROVAL ||
            member.status === UserStatus.PENDING_APPROVAL ? (
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
                  {member.status === UserStatus.PENDING_CONFIRMATION
                    ? 'Confirm'
                    : 'Approve'}
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
            <MemberGeneralDescription member={member} />
          </TabPane>
          <TabPane key='vehicle' tab='Vehicle'>
            <MemberVehicleDescription member={member} />
          </TabPane>
          <TabPane key='emergency' tab='Emergency'>
            <MemberEmergencyDescription member={member} />
          </TabPane>
          <TabPane key='transfer' tab='Transfer'>
            <MemberTransferDescription member={member} />
          </TabPane>
          <TabPane key='settings' tab='Settings'>
            <MemberSettingsDescription member={member} />
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <Loading cover='content' />
  );
};

export default memo(MemberDetailsView);
/* eslint-enable */
