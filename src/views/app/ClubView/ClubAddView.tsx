/* eslint-disable */
import { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import { AxiosResponse } from 'axios';

// Types
import { ResponseData } from '@/types/api';
import { Club, ClubFormData } from '@/types/club';

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
import { ClubGeneralForm, ClubSecurityQuestionsForm } from '@/components/club';

const { TabPane } = Tabs;

const ClubAddView: FC<RouteComponentProps> = ({ history }) => {
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<ClubFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  useEffect(() => {
    form.setFieldsValue({
      logo: [],
      security_questions: [],
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
  const handleAdd: FormProps<ClubFormData>['onFinish'] = async (formData) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const addData: FormData = new FormData();

      (Object.keys(formData) as Array<keyof ClubFormData>).forEach((key) => {
        if (formData[key]) {
          switch (key) {
            case 'logo':
              if (formData.logo?.length === 0) {
                if (formData.logo[0].originFileObj) {
                  addData.set('file', formData.logo[0].originFileObj);
                }
              }
              break;

            case 'security_questions':
              break;

            default:
              addData.set(key, formData[key] as string);
              break;
          }
        }
      });

      const {
        data: { data: addedClub },
      } = await API.post<ResponseData<Club>>('/account/create', addData);

      if (formData.security_questions?.length > 0) {
        const securityQuestionRequests: Promise<AxiosResponse>[] = [];

        for (const securityQuestion of formData.security_questions) {
          const securityQuestionFormData: FormData = new FormData();
          securityQuestionFormData.set(
            'account_id',
            String(addedClub.account_id),
          );
          securityQuestionFormData.set('question', securityQuestion.question);
          securityQuestionFormData.set(
            'is_file_upload',
            securityQuestion.is_file_upload ? String(1) : String(0),
          );

          securityQuestionRequests.push(
            API.post(
              '/account/add-security-questions',
              securityQuestionFormData,
            ),
          );
        }

        if (securityQuestionRequests.length > 0) {
          await Promise.all(securityQuestionRequests);
        }
      }

      notification.success({
        message: (
          <span>
            Added club <strong>{addedClub.company}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/clubs`,
      });
    } catch (err) {
      setLoading(false);
    }
  };
  const handleAddFailed: FormProps<ClubFormData>['onFinishFailed'] = ({
    errorFields,
  }) => {
    const requiredFields: Record<string, Array<keyof ClubFormData>> = {
      general: ['company', 'company_full_name'],
    };

    for (const errorField of errorFields) {
      const { name } = errorField;

      for (const tab in requiredFields) {
        if (requiredFields[tab].includes(name[0] as keyof ClubFormData)) {
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
      pathname: `${APP_PREFIX_PATH}/clubs`,
    });
  };

  return (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='add-club-form'
        className='ant-advanced-search-form'
        onFinish={handleAdd}
        onFinishFailed={handleAddFailed}
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
                  <h2 className='mb-3'>Add Club</h2>
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
                <TabPane key='general' tab='General' forceRender>
                  <ClubGeneralForm logo={form.getFieldsValue().logo} />
                </TabPane>
                <TabPane key='security-questions' tab='Security Questions'>
                  <ClubSecurityQuestionsForm />
                </TabPane>
              </Tabs>
            </div>
          </>
        )}
      </Form>
    </>
  );
};

export default ClubAddView;
/* eslint-enable */
