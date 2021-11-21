import { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';

// Types
import { ResponseData } from '@/types/api';
import { Payment, PaymentFormData } from '@/types/payment';

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
import { PaymentGeneralForm } from '@/components/payment';

const { TabPane } = Tabs;

const PaymentAddView: FC<RouteComponentProps> = ({ history }) => {
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<PaymentFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  useEffect(() => {
    form.setFieldsValue({
      image: [],
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
  const handleAdd: FormProps<PaymentFormData>['onFinish'] = async (
    formData,
  ) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const addData: FormData = new FormData();

      (Object.keys(formData) as Array<keyof PaymentFormData>).forEach((key) => {
        if (formData[key]) {
          switch (key) {
            case 'image':
              if (formData.image?.length === 1) {
                if (formData.image[0].originFileObj) {
                  addData.set('file', formData.image[0].originFileObj);
                }
              }
              break;

            default:
              addData.set(key, formData[key] as string);
              break;
          }
        }
      });

      await API.post<ResponseData<Payment>>('/userpayment/create', addData);

      notification.success({
        message: (
          <span>
            Added payment <strong>{formData.name}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/payments`,
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
      pathname: `${APP_PREFIX_PATH}/payments`,
    });
  };

  return (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='add-payment-form'
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
                  <h2 className='mb-3'>Add Payment</h2>
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
                  <PaymentGeneralForm image={form.getFieldsValue().image} />
                </TabPane>
              </Tabs>
            </div>
          </>
        )}
      </Form>
    </>
  );
};

export default PaymentAddView;
