import { FC, memo, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tooltip, Button, Tabs, TabsProps } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// Types
import { ResponseData } from '@/types/api';
import { Event } from '@/types/event';

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
  EventGeneralDescription,
  EventAttendeeList,
  EventGalleryDescription,
} from '@/components/event';

const { TabPane } = Tabs;

const EventDetailsView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await API.get<ResponseData<Event>>(`/event/view/${id}`);

      setEvent(data.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      void fetchEvent();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/events`,
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

  return !loading && event !== null ? (
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
              <h2 className='mr-2'>{event.title}</h2>
              <Tooltip title='Edit' placement='bottom'>
                <Button
                  type='text'
                  icon={<EditOutlined />}
                  onClick={() =>
                    history.push({
                      pathname: `${APP_PREFIX_PATH}/events/edit/${event.event_id}`,
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
            <EventGeneralDescription event={event} />
          </TabPane>
          <TabPane key='attendees' tab='Attendees'>
            <EventAttendeeList event={event} />
          </TabPane>
          <TabPane key='gallery' tab='Gallery'>
            <EventGalleryDescription galleries={event.galleries} />
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <Loading cover='content' />
  );
};

export default memo(EventDetailsView);
