import { FC, memo, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tooltip, Button, Tabs, TabsProps, notification } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// Types
import { ResponseData } from '@/types/api';
import { Vendor } from '@/types/vendor';
import { UserStatus } from '@/types/user';

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
import { VendorGeneralDescription } from '@/components/vendor';

const { TabPane } = Tabs;

const VendorDetailsView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [rejectLoading, setRejectLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchVendor = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await API.get<ResponseData<Vendor>>(
        '/vendor/vendor-view',
        {
          params: {
            id,
          },
        },
      );

      setVendor(data.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      void fetchVendor();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/vendors`,
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

      if (vendor) {
        const approveData: FormData = new FormData();
        approveData.set('id', String(vendor.user_id));

        await API.post('/vendor/approve', approveData);

        notification.success({
          message: (
            <span>
              Approved vendor <strong>{vendor.vendor_name}</strong>
            </span>
          ),
        });
      }

      setApproveLoading(false);

      void fetchVendor();

      history.push({
        pathname: `${APP_PREFIX_PATH}/vendors`,
      });
    } catch (err) {
      setApproveLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      setRejectLoading(true);

      if (vendor) {
        const rejectData: FormData = new FormData();
        rejectData.set('id', String(vendor.user_id));

        await API.post('/vendor/reject', rejectData);

        notification.success({
          message: (
            <span>
              Rejected vendor <strong>{vendor.vendor_name}</strong>
            </span>
          ),
        });
      }

      setRejectLoading(false);

      void fetchVendor();

      history.push({
        pathname: `${APP_PREFIX_PATH}/vendors`,
      });
    } catch (err) {
      setRejectLoading(false);
    }
  };

  return !loading && vendor !== null ? (
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
              <h2 className='mr-2'>{vendor.vendor_name}</h2>
              <Tooltip title='Edit' placement='bottom'>
                <Button
                  type='text'
                  icon={<EditOutlined />}
                  onClick={() =>
                    history.push({
                      pathname: `${APP_PREFIX_PATH}/vendors/edit/${vendor.user_id}`,
                    })
                  }
                />
              </Tooltip>
            </Flex>

            {vendor.status === UserStatus.PENDING_CONFIRMATION ||
            vendor.status === UserStatus.PENDING_RENEWAL_APPROVAL ||
            vendor.status === UserStatus.PENDING_APPROVAL ? (
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
                  {vendor.status === UserStatus.PENDING_CONFIRMATION
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
            <VendorGeneralDescription vendor={vendor} />
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <Loading cover='content' />
  );
};

export default memo(VendorDetailsView);
