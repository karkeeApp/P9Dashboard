import { FC, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

// Types
import { ResponseData } from '@/types/api';
import { Ads, AdsFormData } from '@/types/ads';

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
import { AdsGeneralForm } from '@/components/ads';

const { TabPane } = Tabs;

const AdsEditView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState<Ads | null>(null);
  const [form] = Form.useForm<AdsFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { data: fetchedAds },
      } = await API.get<ResponseData<Ads>>('/ads/view', {
        params: {
          id,
        },
      });

      setAds(fetchedAds);

      form.setFieldsValue({
        title: fetchedAds.title,
        summary: fetchedAds.summary,
        file: fetchedAds.file
          ? [{ url: fetchedAds.file, name: fetchedAds.title } as UploadFile]
          : [],
        link: fetchedAds.link,
        is_bottom: fetchedAds.is_bottom,
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      void fetchAds();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/ads`,
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
  const handleEdit: FormProps<AdsFormData>['onFinish'] = async (formData) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const editData: FormData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          switch (key) {
            case 'title':
              editData.set('name', formData[key]);
              break;

            case 'summary':
              editData.set('description', formData[key]);
              break;

            case 'file':
              if (formData.file?.length === 1) {
                if (formData.file[0].originFileObj) {
                  editData.set(key, formData.file[0].originFileObj);
                }
              }
              break;

            default:
              editData.set(key, formData[key] as string);
              break;
          }
        }
      });

      await API.post<ResponseData<Ads>>('/ads/update', editData, {
        params: {
          id,
        },
      });

      notification.success({
        message: (
          <span>
            Edited ads <strong>{formData.title}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/ads`,
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
      pathname: `${APP_PREFIX_PATH}/ads`,
    });
  };

  return ads !== null ? (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='edit-ads-form'
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
                  <h2 className='mb-3'>Edit Ads</h2>
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
                  <AdsGeneralForm image={form.getFieldsValue().file} />
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

export default AdsEditView;
