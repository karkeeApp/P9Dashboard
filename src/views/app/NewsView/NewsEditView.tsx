import { FC, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import update from 'immutability-helper';
import { AxiosResponse } from 'axios';

// Types
import { ResponseData } from '@/types/api';
import { News, NewsFormData } from '@/types/news';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Constants
import { NewsCategoryKeys } from '@/constants/news';

// Custom Hooks
import { useExitPrompt, useQuery } from '@/hooks';

// Utils
import { setSearchParam } from '@/utils/router';

// Components
import { PageHeaderAlt } from '@/components/layout';
import { Flex, Loading } from '@/components/shared';
import { LeavePrompt } from '@/components/util';
import { NewsGeneralForm } from '@/components/news';
import NewsGalleryForm, {
  NewsGalleryFormProps,
} from '@/components/news/NewsGalleryForm';

const { TabPane } = Tabs;

const NewsEditView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [news, setNews] = useState<News | null>(null);
  const [removedGalleries, setRemovedGalleries] = useState<
    NewsFormData['galleries']
  >([]);
  const [form] = Form.useForm<NewsFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { data: fetchedNews },
      } = await API.get<ResponseData<News>>(`/news/view/${id}`);

      setNews(fetchedNews);

      form.setFieldsValue({
        title: fetchedNews.title,
        image: fetchedNews.image
          ? [{ url: fetchedNews.image, name: fetchedNews.title } as UploadFile]
          : [],
        summary: fetchedNews.summary,
        content: fetchedNews.content,
        categories: NewsCategoryKeys.map((category) =>
          fetchedNews[category] ? (fetchedNews[category] as number) : null,
        ).filter((category) => category !== null) as NewsFormData['categories'],
        is_public: Boolean(fetchedNews.is_public),
        galleries: fetchedNews.galleries
          ? fetchedNews.galleries.map(
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
      void fetchNews();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/news`,
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
  const handleRemoveGallery: NewsGalleryFormProps['onRemove'] = (file) => {
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
  const handleEdit: FormProps<NewsFormData>['onFinish'] = async (formData) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const editData: FormData = new FormData();

      (Object.keys(formData) as Array<keyof NewsFormData>).forEach((key) => {
        if (formData[key]) {
          switch (key) {
            case 'image':
              if (formData.image?.length === 1) {
                if (formData.image[0].originFileObj) {
                  editData.set('image', formData.image[0].originFileObj);
                }
              }
              break;

            case 'categories':
              formData.categories.forEach((category) => {
                switch (category) {
                  case 1:
                    editData.set('is_news', String(category));
                    break;

                  case 2:
                    editData.set('is_trending', String(category));
                    break;

                  case 3:
                    editData.set('is_event', String(category));
                    break;

                  case 4:
                    editData.set('is_happening', String(category));
                    break;

                  case 5:
                    editData.set('is_guest', String(category));
                    break;

                  default:
                    break;
                }
              });
              break;

            case 'galleries':
              break;

            case 'is_public':
              editData.set(key, formData[key] === true ? String(1) : String(0));
              break;

            default:
              editData.set(key, formData[key]);
              break;
          }
        }
      });

      const { data } = await API.post<ResponseData<News>>(
        `/news/update/${id}`,
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
              API.post(`/news/remove-image-gallery/${removedGallery.uid}`),
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
          `/news/create-gallery/${news?.news_id as number}`,
          galleryData,
        );
      }

      notification.success({
        message: (
          <span>
            Edited news <strong>{data.data.title}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/news`,
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
      pathname: `${APP_PREFIX_PATH}/news`,
    });
  };

  return news !== null ? (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='edit-news-form'
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
                  <h2 className='mb-3'>Edit News</h2>
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
                  <NewsGeneralForm image={form.getFieldsValue().image} />
                </TabPane>
                <TabPane key='gallery' tab='Gallery'>
                  <NewsGalleryForm onRemove={handleRemoveGallery} />
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

export default NewsEditView;
