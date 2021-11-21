import { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';

// Types
import { ResponseData } from '@/types/api';
import { Banner, BannerFormData } from '@/types/banner';

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
import { BannerGeneralForm } from '@/components/banner';

const { TabPane } = Tabs;

const BannerAddView: FC<RouteComponentProps> = ({ history }) => {
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<BannerFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  useEffect(() => {
    form.setFieldsValue({
      title: '',
      image: [],
      content: '',
      status: true,
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
  const handleAdd: FormProps<BannerFormData>['onFinish'] = async (formData) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const addData: FormData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] || formData[key] === false || formData[key] === 0) {
          switch (key) {
            case 'image':
              if (formData.image) {
                if (formData.image[0].originFileObj) {
                  addData.set('image', formData.image[0].originFileObj);
                }
              }
              break;

            case 'status':
              addData.set('status', formData.status ? String(1) : String(0));
              break;

            default:
              addData.set(key, formData[key] as string);
              break;
          }
        }
      });

      await API.post<ResponseData<Banner>>('/banner/create', addData);

      notification.success({
        message: (
          <span>
            Added banner <strong>{formData.title}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/banners`,
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
      pathname: `${APP_PREFIX_PATH}/banners`,
    });
  };

  return (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='add-banner-form'
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
                  <h2 className='mb-3'>Add Banner</h2>
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
                  <BannerGeneralForm image={form.getFieldsValue().image} />
                </TabPane>
              </Tabs>
            </div>
          </>
        )}
      </Form>
    </>
  );
};

export default BannerAddView;
