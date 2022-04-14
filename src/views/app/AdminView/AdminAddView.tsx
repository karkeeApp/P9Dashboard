/* eslint-disable */
import { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import moment from 'moment';

// Types
import { ResponseData } from '@/types/api';
import { User, UserFormData } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useAuth, useExitPrompt, useQuery } from '@/hooks';

// Utils
import { setSearchParam } from '@/utils/router';

// Components
import { PageHeaderAlt } from '@/components/layout';
import { Flex } from '@/components/shared';
import { LeavePrompt } from '@/components/util';
import {
  AdminGeneralForm,
  AdminVehicleForm,
  AdminEmergencyForm,
  AdminTransferForm,
  AdminSettingsForm,
} from '@/components/admin';

const { TabPane } = Tabs;

const AdminAddView: FC<RouteComponentProps> = ({ history }) => {
  const { currentUser } = useAuth();
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<UserFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  useEffect(() => {
    form.setFieldsValue({
      img_profile: [],
      img_nric: [],
      transfer_screenshot: [],
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
  const handleAdd: FormProps<UserFormData>['onFinish'] = async (formData) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const addData: FormData = new FormData();
      addData.set('account_id', String(currentUser?.account_id));

      Object.keys(formData).forEach((key) => {
        if (formData[key] || formData[key] === 0) {
          switch (key) {
            case 'birthday':
              addData.set(key, moment(formData[key]).format('YYYY-MM-DD'));
              break;

            case 'member_expire':
              if (formData[key])
                addData.set(key, moment(formData[key]).format('YYYY-MM-DD'));
              else addData.set(key, moment().format('YYYY-MM-DD'));
              break;

            case 'transfer_date':
              addData.set(key, moment(formData[key]).format('YYYY-MM-DD'));
              break;

            default:
              addData.set(key, formData[key] as string);
              break;
          }
        }
      });

      const { data } = await API.post<ResponseData<User>>(
        '/member/create',
        addData,
      );

      notification.success({
        message: (
          <span>
            Added admin <strong>{data.data.fullname}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/admins`,
      });
    } catch (err) {
      setLoading(false);
    }
  };
  const handleAddFailed: FormProps<UserFormData>['onFinishFailed'] = ({
    errorFields,
  }) => {
    const requiredFields: Record<string, Array<keyof UserFormData>> = {
      general: ['fullname'],
      emergency: ['mobile'],
      settings: ['email', 'password', 'password_confirm', 'role'],
    };

    for (const errorField of errorFields) {
      const { name } = errorField;

      for (const tab in requiredFields) {
        if (requiredFields[tab].includes(name[0] as string)) {
          setActiveTab(tab);
          return;
        }
      }
    }
  };
  const handleDiscard = () => {
    if (form.isFieldsTouched()) {
      setShowExitPrompt(true);
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/admins`,
    });
  };

  return (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='add-admin-form'
        className='ant-advanced-search-form'
        onFinish={handleAdd}
        onFinishFailed={handleAddFailed}
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
                  <h2 className='mb-3'>Add Admin</h2>
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
                <TabPane tab='General' key='general' forceRender>
                  <AdminGeneralForm
                    imgProfile={form.getFieldsValue().img_profile}
                    imgNRIC={form.getFieldsValue().img_nric}
                  />
                </TabPane>
                <TabPane tab='Vehicle' key='vehicle' forceRender>
                  <AdminVehicleForm />
                </TabPane>
                <TabPane tab='Emergency' key='emergency' forceRender>
                  <AdminEmergencyForm />
                </TabPane>
                <TabPane tab='Transfer' key='transfer' forceRender>
                  <AdminTransferForm
                    transferScreenshot={
                      form.getFieldsValue().transfer_screenshot
                    }
                  />
                </TabPane>
                <TabPane tab='Settings' key='settings' forceRender>
                  <AdminSettingsForm />
                </TabPane>
              </Tabs>
            </div>
          </>
        )}
      </Form>
    </>
  );
};

export default AdminAddView;
/* eslint-enable */
