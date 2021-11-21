import { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import moment from 'moment';

// Types
import { ResponseData } from '@/types/api';
import { Event, EventFormData } from '@/types/event';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useExitPrompt, useQuery } from '@/hooks';

// Utils
import { setSearchParam } from '@/utils/router';

// Components
import { PageHeaderAlt } from '@/components/layout';
import { Flex } from '@/components/shared';
import { LeavePrompt } from '@/components/util';
import { EventGeneralForm, EventGalleryForm } from '@/components/event';

const { TabPane } = Tabs;

const EventAddView: FC<RouteComponentProps> = ({ history }) => {
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<EventFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  useEffect(() => {
    form.setFieldsValue({
      title: '',
      image: [],
      summary: '',
      content: '',
      place: '',
      is_happening: false,
      is_public: false,
      is_paid: false,
      galleries: [],
    });

    return () => setShowExitPrompt(false);
  }, []);

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
  const handleAdd: FormProps<EventFormData>['onFinish'] = async (formData) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const addData: FormData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] || formData[key] === false) {
          switch (key) {
            case 'image':
              if (formData.image?.length === 1) {
                if (formData.image[0].originFileObj) {
                  addData.set('image', formData.image[0].originFileObj);
                }
              }
              break;

            case 'event_date':
              addData.set(
                key,
                moment(formData[key]).format('YYYY-MM-DD HH:mm:ss'),
              );
              break;

            case 'cut_off_at':
              addData.set(
                key,
                moment(formData[key]).format('YYYY-MM-DD HH:mm:ss'),
              );
              break;

            case 'galleries':
              break;

            default:
              if (formData[key] === true) {
                addData.set(key, String(1));
              } else if (formData[key] === false) {
                addData.set(key, String(0));
              } else {
                addData.set(key, formData[key] as string);
              }
              break;
          }
        }
      });

      const { data } = await API.post<ResponseData<Event>>(
        '/event/create',
        addData,
      );

      if (formData.galleries && formData.galleries.length > 0) {
        const galleryData: FormData = new FormData();

        formData.galleries.forEach((gallery) => {
          if (gallery.originFileObj) {
            galleryData.append('files[]', gallery.originFileObj);
          }
        });

        await API.post(
          `/event/create-gallery/${data.data.event_id}`,
          galleryData,
        );
      }

      notification.success({
        message: (
          <span>
            Added event <strong>{data.data.title}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/events`,
      });
    } catch (err) {
      setLoading(false);
    }
  };
  const handleDiscard = () => {
    if (form.isFieldsTouched()) {
      setShowExitPrompt(true);
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/events`,
    });
  };

  return (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='add-event-form'
        className='ant-advanced-search-form'
        onFinish={handleAdd}
        onValuesChange={() => setShowExitPrompt(true)}
        requiredMark={false}
      >
        {() => (
          <>
            <PageHeaderAlt className='border-bottom' overlap>
              <div className='container'>
                <Flex
                  className='py-2'
                  mobileFlex={false}
                  justifyContent='between'
                  alignItems='center'
                >
                  <h2 className='mb-3'>Add Event</h2>
                  <div className='mb-3'>
                    <Button
                      className='mr-2'
                      type='text'
                      danger
                      disabled={loading}
                      onClick={handleDiscard}
                    >
                      Discard
                    </Button>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={loading}
                      disabled={!form.isFieldsTouched()}
                    >
                      Add
                    </Button>
                  </div>
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
                  <EventGeneralForm image={form.getFieldsValue().image} />
                </TabPane>
                <TabPane key='gallery' tab='Gallery'>
                  <EventGalleryForm />
                </TabPane>
              </Tabs>
            </div>
          </>
        )}
      </Form>
    </>
  );
};

export default EventAddView;
