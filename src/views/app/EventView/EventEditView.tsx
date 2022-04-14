/* eslint-disable */
import { FC, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { AxiosResponse } from 'axios';
import update from 'immutability-helper';
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
import { Flex, Loading } from '@/components/shared';
import { LeavePrompt } from '@/components/util';
import { EventGeneralForm } from '@/components/event';
import EventGalleryForm, {
  EventGalleryFormProps,
} from '@/components/event/EventGalleryForm';

const { TabPane } = Tabs;

const EventEditView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [removedGalleries, setRemovedGalleries] = useState<
    EventFormData['galleries']
  >([]);
  const [form] = Form.useForm<EventFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { data: fetchedEvent },
      } = await API.get<ResponseData<Event>>(`/event/view/${id}`);

      setEvent(fetchedEvent);

      form.setFieldsValue({
        title: fetchedEvent.title,
        image: fetchedEvent.image
          ? [
              {
                url: fetchedEvent.image,
                name: fetchedEvent.title,
              } as UploadFile,
            ]
          : [],
        summary: fetchedEvent.summary,
        content: fetchedEvent.content,
        place: fetchedEvent.place,
        event_date: moment(fetchedEvent.event_date),
        cut_off_at: moment(fetchedEvent.cut_off_at),
        limit: fetchedEvent.limit,
        is_public: fetchedEvent.is_public,
        is_paid: fetchedEvent.is_paid,
        event_fee: fetchedEvent.event_fee,
        galleries: fetchedEvent.galleries
          ? fetchedEvent.galleries.map(
              (gallery) =>
                ({
                  uid: String(gallery.id),
                  url: gallery.url,
                  name: gallery.url,
                } as UploadFile),
            )
          : [],
      });

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

  // Property Handlers
  const handleRemoveGallery: EventGalleryFormProps['onRemove'] = (file) => {
    setRemovedGalleries(
      update(removedGalleries, {
        $push: [file],
      }),
    );
  };

  // Main Handlers
  const handleChangeTab: TabsProps['onChange'] = (newActiveTab) => {
    setSearchParam('tab', newActiveTab);
    setActiveTab(newActiveTab);
  };
  const handleEdit: FormProps<EventFormData>['onFinish'] = async (formData) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const editData: FormData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] || formData[key] === 0 || formData[key] === false) {
          switch (key) {
            case 'image':
              if (formData.image?.length === 1) {
                if (formData.image[0].originFileObj) {
                  editData.set('image', formData.image[0].originFileObj);
                }
              }
              break;

            case 'event_date':
              editData.set(
                key,
                moment(formData[key]).format('YYYY-MM-DD HH:mm:ss'),
              );
              break;

            case 'cut_off_at':
              editData.set(
                key,
                moment(formData[key]).format('YYYY-MM-DD HH:mm:ss'),
              );
              break;

            case 'galleries':
              break;

            default:
              if (formData[key] === true) {
                editData.set(key, String(1));
              } else if (formData[key] === false) {
                editData.set(key, String(0));
              } else {
                editData.set(key, formData[key] as string);
              }
              break;
          }
        }
      });

      const { data } = await API.post<ResponseData<Event>>(
        `/event/update/${event?.event_id as number}`,
        editData,
      );

      // Removed Galleries
      if (removedGalleries && removedGalleries.length > 0) {
        const removeGalleryRequests: Promise<AxiosResponse>[] = [];

        for (const removedGallery of removedGalleries) {
          if (
            !isNaN(Number(removedGallery.uid)) &&
            Number(removedGallery.uid) > 0
          ) {
            removeGalleryRequests.push(
              API.post(`/event/remove-image-gallery/${removedGallery.uid}`),
            );
          }
        }

        if (removeGalleryRequests.length > 0) {
          await Promise.all(removeGalleryRequests);
        }
      }

      // Added Galleries
      if (formData.galleries && formData.galleries.length > 0) {
        const galleryData: FormData = new FormData();

        for (const gallery of formData.galleries) {
          if (isNaN(Number(gallery.uid)) && gallery.originFileObj) {
            galleryData.append('files[]', gallery.originFileObj);
          }
        }

        await API.post(
          `/event/create-gallery/${event?.event_id as number}`,
          galleryData,
        );
      }

      notification.success({
        message: (
          <span>
            Edited event <strong>{data.data.title}</strong>
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

  return event !== null ? (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='edit-event-form'
        className='ant-advanced-search-form'
        onFinish={handleEdit}
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
                  <h2 className='mb-3'>Edit Event</h2>
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
                      Save
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
                  <EventGalleryForm onRemove={handleRemoveGallery} />
                </TabPane>
              </Tabs>
            </div>
          </>
        )}
      </Form>
    </>
  ) : (
    <Loading cover='content' />
  );
};

export default EventEditView;
/* eslint-enable */
