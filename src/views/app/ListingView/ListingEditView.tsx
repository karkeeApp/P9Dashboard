/* eslint-disable */
import { FC, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import update from 'immutability-helper';
import { AxiosResponse } from 'axios';

// Types
import { ResponseData } from '@/types/api';
import { Listing, ListingFormData } from '@/types/listing';

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
import { ListingGeneralForm } from '@/components/listing';
import ListingGalleryForm, {
  ListingGalleryFormProps,
} from '@/components/listing/ListingGalleryForm';

const { TabPane } = Tabs;

const ListingEditView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [listing, setListing] = useState<Listing | null>(null);
  const [removedGallery, setRemovedGallery] = useState<
    ListingFormData['gallery']
  >([]);
  const [form] = Form.useForm<ListingFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchListing = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { data: fetchedListing },
      } = await API.get<ResponseData<Listing>>('/listing/view-by-id', {
        params: {
          listing_id: id,
        },
      });

      setListing(fetchedListing);

      form.setFieldsValue({
        title: fetchedListing.title,
        content: fetchedListing.content,
        image: fetchedListing.image
          ? [
              {
                url: fetchedListing.image,
                name: fetchedListing.title,
              } as UploadFile,
            ]
          : [],
        gallery: fetchedListing.gallery
          ? fetchedListing.gallery.map(
              (g) =>
                ({
                  uid: String(g.id),
                  url: g.url,
                  name: g.url,
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
      void fetchListing();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/listings`,
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
  const handleRemoveGallery: ListingGalleryFormProps['onRemove'] = (file) => {
    setRemovedGallery(
      update(removedGallery, {
        $push: [file],
      }),
    );
  };

  // Main Handlers
  const handleChangeTab: TabsProps['onChange'] = (newActiveTab) => {
    setSearchParam('tab', newActiveTab);
    setActiveTab(newActiveTab);
  };
  const handleEdit: FormProps<ListingFormData>['onFinish'] = async (
    formData,
  ) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const editData: FormData = new FormData();

      (Object.keys(formData) as Array<keyof ListingFormData>).forEach((key) => {
        if (formData[key]) {
          switch (key) {
            case 'image':
              if (formData.image?.length === 1) {
                if (formData.image[0].originFileObj) {
                  editData.set('file', formData.image[0].originFileObj);
                }
              }
              break;

            case 'gallery':
              break;

            default:
              editData.set(key, formData[key]);
              break;
          }
        }
      });

      const { data } = await API.post<ResponseData<Listing>>(
        '/listing/edit',
        editData,
        {
          params: {
            listing_id: id,
          },
        },
      );

      // Removed Gallery
      if (removedGallery && removedGallery.length > 0) {
        const removeGalleryRequests: Promise<AxiosResponse>[] = [];

        for (const rG of removedGallery) {
          if (!isNaN(Number(rG.uid)) && Number(rG.uid) > 0) {
            removeGalleryRequests.push(
              API.post('/listing/remove-image-gallery', null, {
                params: {
                  id: rG.uid,
                },
              }),
            );
          }
        }

        if (removeGalleryRequests.length > 0) {
          await Promise.all(removeGalleryRequests);
        }
      }

      // Added Gallery
      if (formData.gallery && formData.gallery.length > 0) {
        const galleryData: FormData = new FormData();

        for (const g of formData.gallery) {
          if (isNaN(Number(g.uid)) && g.originFileObj) {
            galleryData.append('files[]', g.originFileObj);
          }
        }

        await API.post(
          `/listing/create-gallery/${data.data.listing_id}`,
          galleryData,
        );
      }

      notification.success({
        message: (
          <span>
            Edited listing <strong>{data.data.title}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/listings`,
      });
      window.location.reload();
    } catch (err) {
      setLoading(false);
    }
  };
  const handleDiscard = () => {
    if (form.isFieldsTouched()) {
      setShowExitPrompt(true);
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/listings`,
    });
  };

  return listing !== null ? (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='edit-listing-form'
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
                  <h2 className='mb-3'>Edit Listing</h2>
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
                      Edit
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
                  <ListingGeneralForm image={form.getFieldsValue().image} />
                </TabPane>
                <TabPane key='gallery' tab='Gallery'>
                  <ListingGalleryForm onRemove={handleRemoveGallery} />
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

export default ListingEditView;
/* eslint-enable */
