/* eslint-disable */
import { FC, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { AxiosResponse } from 'axios';
import update from 'immutability-helper';

// Types
import { ResponseData } from '@/types/api';
import { Club, ClubFormData, ClubSecurityQuestion } from '@/types/club';

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
import { ClubGeneralForm } from '@/components/club';
import ClubSecurityQuestionsForm, {
  ClubSecurityQuestionsFormProps,
} from '@/components/club/ClubSecurityQuestionsForm';

const { TabPane } = Tabs;

interface ClubState {
  club: Club | null;
  securityQuestions: ClubSecurityQuestion[];
}

const ClubEditView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const [clubState, setClubState] = useState<ClubState>({
    club: null,
    securityQuestions: [],
  });
  const [form] = Form.useForm<ClubFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchClub = useCallback(async () => {
    try {
      setLoading(true);

      const [
        {
          data: { data: fetchedClub },
        },
        {
          data: { data: fetchedSecurityQuestions },
        },
      ] = await Promise.all([
        API.get<ResponseData<Club>>('/account/view', {
          params: {
            account_id: id,
          },
        }),
        API.get<ResponseData<ClubSecurityQuestion[]>>(
          '/account/list-security-questions',
          {
            params: {
              account_id: id,
            },
          },
        ),
      ]);

      form.setFieldsValue({
        company: fetchedClub.company,
        company_full_name: fetchedClub.company_full_name,
        address: fetchedClub.address as string,
        contact_name: fetchedClub.contact_name,
        email: fetchedClub.email,
        logo: fetchedClub.logo
          ? [
              {
                url: fetchedClub.logo_url,
                name: fetchedClub.logo,
              } as UploadFile,
            ]
          : [],
        security_questions: fetchedSecurityQuestions,
      });

      setClubState(
        update(clubState, {
          club: {
            $set: fetchedClub,
          },
          securityQuestions: {
            $set: fetchedSecurityQuestions,
          },
        }),
      );

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      void fetchClub();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/clubs`,
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
  const handleEdit: FormProps<ClubFormData>['onFinish'] = async (formData) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const editData: FormData = new FormData();

      (Object.keys(formData) as Array<keyof ClubFormData>).forEach((key) => {
        if (formData[key]) {
          switch (key) {
            case 'logo':
              if (formData.logo?.length === 1) {
                if (formData.logo[0].originFileObj) {
                  editData.set('file', formData.logo[0].originFileObj);
                }
              }
              break;

            case 'security_questions':
              break;

            default:
              editData.set(key, formData[key] as string);
              break;
          }
        }
      });

      const {
        data: { data: editedClub },
      } = await API.post<ResponseData<Club>>('/account/update', editData, {
        params: {
          account_id: id,
        },
      });

      if (formData.security_questions?.length > 0) {
        /**
         *
         * Added Security Questions
         *
         */

        const addedSecurityQuestions = formData.security_questions.filter(
          (sq) => clubState.securityQuestions.every((s) => s.id !== sq.id),
        );

        if (addedSecurityQuestions.length > 0) {
          const addedSecurityQuestionRequests: Promise<AxiosResponse>[] = [];

          for (const addedSecurityQuestion of addedSecurityQuestions) {
            const addedSecurityQuestionFormData: FormData = new FormData();
            addedSecurityQuestionFormData.set(
              'account_id',
              String(editedClub.account_id),
            );
            addedSecurityQuestionFormData.set(
              'question',
              addedSecurityQuestion.question,
            );
            addedSecurityQuestionFormData.set(
              'is_file_upload',
              addedSecurityQuestion.is_file_upload ? String(1) : String(0),
            );

            addedSecurityQuestionRequests.push(
              API.post(
                '/account/add-security-questions',
                addedSecurityQuestionFormData,
              ),
            );
          }

          if (addedSecurityQuestionRequests.length > 0) {
            await Promise.all(addedSecurityQuestionRequests);
          }
        }

        /**
         *
         * Edited Security Questions
         *
         */

        const editedSecurityQuestions = formData.security_questions.filter(
          (sq) => clubState.securityQuestions.some((s) => s.id === sq.id),
        );

        if (editedSecurityQuestions.length > 0) {
          const editedSecurityQuestionRequests: Promise<AxiosResponse>[] = [];

          for (const editedSecurityQuestion of editedSecurityQuestions) {
            const editedSecurityQuestionFormData: FormData = new FormData();
            editedSecurityQuestionFormData.set(
              'question',
              editedSecurityQuestion.question,
            );
            editedSecurityQuestionFormData.set(
              'is_file_upload',
              editedSecurityQuestion.is_file_upload ? String(1) : String(0),
            );

            editedSecurityQuestionRequests.push(
              API.post(
                `/account/edit-security-questions/${editedSecurityQuestion.id}`,
                editedSecurityQuestionFormData,
              ),
            );
          }

          if (editedSecurityQuestionRequests.length > 0) {
            await Promise.all(editedSecurityQuestionRequests);
          }
        }
      }

      notification.success({
        message: (
          <span>
            Edited club <strong>{editedClub.company}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/clubs`,
      });
      window.location.reload();
    } catch (err) {
      setLoading(false);
    }
  };
  const handleEditFailed: FormProps<ClubFormData>['onFinishFailed'] = ({
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

  // Field Handlers
  const handleRemoveSecurityQuestions: ClubSecurityQuestionsFormProps['onRemove'] =
    async (index) => {
      const { security_questions } = form.getFieldsValue();

      if (security_questions[index]) {
        if (security_questions[index].id) {
          await API.post(
            `/account/delete-security-questions/${security_questions[index].id}`,
          );
          return Promise.resolve();
        }
      }

      return Promise.resolve();
    };

  return clubState.club !== null ? (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='edit-club-form'
        className='ant-advanced-search-form'
        onFinish={handleEdit}
        onFinishFailed={handleEditFailed}
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
                  <h2 className='mb-3'>Edit Club</h2>
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
                <TabPane key='general' tab='General' forceRender>
                  <ClubGeneralForm logo={form.getFieldsValue().logo} />
                </TabPane>
                <TabPane key='security-questions' tab='Security Questions'>
                  <ClubSecurityQuestionsForm
                    onRemove={handleRemoveSecurityQuestions}
                  />
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

export default ClubEditView;
/* eslint-enable */
