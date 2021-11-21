import { FC, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

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
import { Flex, Loading } from '@/components/shared';
import { LeavePrompt } from '@/components/util';
import { BannerGeneralForm } from '@/components/banner';

const { TabPane } = Tabs;

const BannerEditView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [form] = Form.useForm<BannerFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchBanner = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { data: fetchedBanner },
      } = await API.get<ResponseData<Banner>>(`/banner/view/${id}`);

      setBanner(fetchedBanner);

      form.setFieldsValue({
        title: fetchedBanner.title,
        image: [
          {
            url: fetchedBanner.image,
            name: fetchedBanner.filename,
          } as UploadFile,
        ],
        content: fetchedBanner.content,
        status: Boolean(fetchedBanner.status),
      });

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
  const handleEdit: FormProps<BannerFormData>['onFinish'] = async (
    formData,
  ) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const editData: FormData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] || formData[key] === false || formData[key] === 0) {
          switch (key) {
            case 'image':
              if (formData.image?.length === 1) {
                if (formData.image[0].originFileObj) {
                  editData.set('image', formData.image[0].originFileObj);
                }
              }
              break;

            case 'status':
              editData.set('status', formData.status ? String(1) : String(0));
              break;

            default:
              editData.set(key, formData[key]?.toString() || '');
              break;
          }
        }
      });

      await API.post<ResponseData<Banner>>(`/banner/update/${id}`, editData);

      notification.success({
        message: (
          <span>
            Edited banner <strong>{formData.title}</strong>
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

  return banner !== null ? (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='edit-banner-form'
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
                  <h2 className='mb-3'>Edit Banner</h2>
                  <div className='mb-3'>
                    <Button
                      className='mr-3'
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
                  <BannerGeneralForm image={form.getFieldsValue().image} />
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

export default BannerEditView;
