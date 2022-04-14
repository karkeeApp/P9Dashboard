/* eslint-disable */
import { FC, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import moment from 'moment';

// Types
import { ResponseData } from '@/types/api';
import { Vendor, VendorFormData } from '@/types/vendor';

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
import { VendorGeneralForm } from '@/components/vendor';

const { TabPane } = Tabs;

const VendorEditView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [form] = Form.useForm<VendorFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchVendor = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await API.get<ResponseData<Vendor>>(
        '/vendor/vendor-view',
        {
          params: {
            id,
          },
        },
      );

      const result = data.data;
      if (result) {
        setVendor(result);

        form.setFieldsValue({
          vendor_name: result.vendor_name,
          about: result.about,
          founded_date: moment(result.founded_date).isValid()
            ? moment(result.founded_date)
            : undefined,
          add_1: result.add_1,
          add_2: result.add_2,
          postal_code: Number(result.postal_code),
          country: result.country,
        });
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      void fetchVendor();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/vendors`,
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
  const handleEdit: FormProps<VendorFormData>['onFinish'] = async (
    formData,
  ) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const editData: FormData = new FormData();

      (Object.keys(formData) as Array<keyof VendorFormData>).forEach((key) => {
        if (formData[key]) {
          switch (key) {
            case 'founded_date':
              editData.set(key, moment(formData[key]).format('YYYY-MM-DD'));
              break;

            default:
              editData.set(key, formData[key] as string);
              break;
          }
        }
      });

      await API.post<ResponseData<Vendor>>('/vendor/edit-vendor', editData, {
        params: {
          id,
        },
      });

      notification.success({
        message: (
          <span>
            Edited vendor <strong>{formData.vendor_name}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/vendors`,
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
      pathname: `${APP_PREFIX_PATH}/vendors`,
    });
  };

  return !loading && vendor !== null ? (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='edit-vendor-form'
        className='ant-advanced-search-form'
        onFinish={handleEdit}
        onValuesChange={() => setShowExitPrompt(true)}
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
                  <h2 className='mb-3'>Edit Vendor</h2>
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
                  <VendorGeneralForm />
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

export default VendorEditView;
/* eslint-enable */
