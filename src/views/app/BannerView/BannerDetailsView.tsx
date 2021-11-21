import { FC, memo, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tooltip, Button, Tabs, TabsProps } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// Types
import { ResponseData } from '@/types/api';
import { Banner } from '@/types/banner';

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
import { BannerGeneralDescription } from '@/components/banner';

const { TabPane } = Tabs;

const BannerDetailsView: FC<RouteComponentProps<{ id: string }>> = ({
  match,
  history,
}) => {
  const { id } = match.params;
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchBanner = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { data: fetchedBanner },
      } = await API.get<ResponseData<Banner>>(`/banner/view/${id}`);

      setBanner(fetchedBanner);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      void fetchBanner();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/banners`,
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

  return !loading && banner !== null ? (
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
              <h2 className='mr-2'>{banner.title}</h2>
              <Tooltip title='Edit' placement='bottom'>
                <Button
                  type='text'
                  icon={<EditOutlined />}
                  onClick={() =>
                    history.push({
                      pathname: `${APP_PREFIX_PATH}/banners/edit/${banner.id}`,
                    })
                  }
                />
              </Tooltip>
            </Flex>
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
            <BannerGeneralDescription banner={banner} />
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <Loading cover='content' />
  );
};

export default memo(BannerDetailsView);
