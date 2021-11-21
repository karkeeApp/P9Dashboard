import { FC, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

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
import { Flex, Loading } from '@/components/shared';
import { LeavePrompt } from '@/components/util';
import { PaymentGeneralForm } from '@/components/payment';

const { TabPane } = Tabs;

const PaymentEditView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [form] = Form.useForm<PaymentFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchPayment = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { data: fetchedPayment },
      } = await API.get<ResponseData<Payment>>('/userpayment/view', {
        params: {
          id,
        },
      });

      setPayment(fetchedPayment);

      form.setFieldsValue({
        name: fetchedPayment.name,
        amount: fetchedPayment.amount,
        image: fetchedPayment.link
          ? [
              {
                url: fetchedPayment.link,
                name: fetchedPayment.name,
              } as UploadFile,
            ]
          : [],
        payment_for: fetchedPayment.payment_for,
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      void fetchPayment();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/payments`,
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
  const handleEdit: FormProps<PaymentFormData>['onFinish'] = async (
    formData,
  ) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const editData: FormData = new FormData();

      (Object.keys(formData) as Array<keyof PaymentFormData>).forEach((key) => {
        if (formData[key]) {
          switch (key) {
            case 'image':
              if (formData.image?.length === 1) {
                if (formData.image[0].originFileObj) {
                  editData.set('file', formData.image[0].originFileObj);
                }
              }
              break;

            default:
              editData.set(key, formData[key] as string);
              break;
          }
        }
      });

      await API.post<ResponseData<PaymentFormData>>(
        '/userpayment/update',
        editData,
        {
          params: {
            id,
          },
        },
      );

      notification.success({
        message: (
          <span>
            Edited payment <strong>{formData.name}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/payments`,
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
      pathname: `${APP_PREFIX_PATH}/payments`,
    });
  };

  return payment !== null ? (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='edit-payment-form'
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
                  <h2 className='mb-3'>Edit Payment</h2>
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
                  <PaymentGeneralForm image={form.getFieldsValue().image} />
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

export default PaymentEditView;
