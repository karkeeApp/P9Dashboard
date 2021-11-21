import { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';

// Types
import { ResponseData } from '@/types/api';
import { News, NewsFormData } from '@/types/news';

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
import { NewsGeneralForm, NewsGalleryForm } from '@/components/news';

const { TabPane } = Tabs;

const NewsAddView: FC<RouteComponentProps> = ({ history }) => {
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<NewsFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  useEffect(() => {
    form.setFieldsValue({
      title: '',
      image: [],
      summary: '',
      content: '',
      is_public: true,
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
  const handleAdd: FormProps<NewsFormData>['onFinish'] = async (formData) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const addData: FormData = new FormData();

      (Object.keys(formData) as Array<keyof NewsFormData>).forEach((key) => {
        if (formData[key]) {
          switch (key) {
            case 'image':
              if (formData.image?.length === 1) {
                if (formData.image[0].originFileObj) {
                  addData.set('image', formData.image[0].originFileObj);
                }
              }
              break;

            case 'categories':
              formData.categories.forEach((category) => {
                switch (category) {
                  case 1:
                    addData.set('is_news', String(category));
                    break;

                  case 2:
                    addData.set('is_trending', String(category));
                    break;

                  case 3:
                    addData.set('is_event', String(category));
                    break;

                  case 4:
                    addData.set('is_happening', String(category));
                    break;

                  case 5:
                    addData.set('is_guest', String(category));
                    break;

                  default:
                    break;
                }
              });
              break;

            case 'is_public':
              addData.set(key, formData[key] === true ? String(1) : String(0));
              break;

            case 'galleries':
              break;

            default:
              addData.set(key, formData[key]);
              break;
          }
        }
      });

      const { data } = await API.post<ResponseData<News>>(
        '/news/create',
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
          `/news/create-gallery/${data.data.news_id}`,
          galleryData,
        );
      }

      notification.success({
        message: (
          <span>
            Added news <strong>{data.data.title}</strong>
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

  return (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='add-news-form'
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
                  <h2 className='mb-3'>Add News</h2>
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
                  <NewsGeneralForm image={form.getFieldsValue().image} />
                </TabPane>
                <TabPane key='gallery' tab='Gallery'>
                  <NewsGalleryForm />
                </TabPane>
              </Tabs>
            </div>
          </>
        )}
      </Form>
    </>
  );
};

export default NewsAddView;
