/* eslint-disable */
import { FC, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormProps, Button, Tabs, TabsProps, notification } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import moment from 'moment';
import { AxiosResponse } from 'axios';

// Types
import { ResponseData } from '@/types/api';
import { User, UserFormData, UserImg } from '@/types/user';

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
import {
  MemberGeneralForm,
  MemberVehicleForm,
  MemberEmergencyForm,
  MemberTransferForm,
} from '@/components/member';
import MemberSettingsForm, {
  MemberSettingsFormProps,
} from '@/components/member/MemberSettingsForm';

const { TabPane } = Tabs;

const MemberEditView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [form] = Form.useForm<UserFormData>();
  const [activeTab, setActiveTab] = useState<TabsProps['activeKey']>('general');

  const fetchMember = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await API.get<ResponseData<User>>(
        '/member/info-by-user-id',
        {
          params: {
            user_id: id,
          },
        },
      );

      const result = data.data;
      if (result) {
        setUser(result);

        form.setFieldsValue({
          fullname: result.fullname,
          nric: result.nric,
          birthday: moment(result.birthday).isValid()
            ? moment(result.birthday)
            : undefined,
          gender: result.gender,
          profession: result.profession,
          company: result.company,
          annual_salary: result.annual_salary,
          member_expire: result.member_expire_raw
            ? moment(result.member_expire_raw)
            : undefined,
          about: result.about,
          add_1: result.add_1,
          add_2: result.add_2,
          unit_no: result.unit_no,
          postal_code: result.postal_code,
          country: result.country,
          chasis_number: result.chasis_number,
          plate_no: result.plate_no,
          car_model: result.car_model,
          are_you_owner: result.are_you_owner,
          registration_code: result.registration_code,
          emergency_no: result.emergency_no,
          contact_person: result.contact_person,
          mobile_code: result.mobile_code,
          mobile: result.mobile,
          img_profile: result.img_profile
            ? [{ url: result.img_profile, name: result.fullname } as UploadFile]
            : [],
          img_nric: result.img_nric
            ? [
                {
                  url: result.img_nric,
                  name: `${result.fullname} - ${result.nric}`,
                } as UploadFile,
              ]
            : [],
          relationship: result.relationship,
          transfer_no: result.transfer_no,
          transfer_screenshot: result.transfer_screenshot
            ? [
                {
                  url: result.transfer_screenshot,
                  name: `${result.fullname} - ${result.transfer_no}`,
                } as UploadFile,
              ]
            : [],
          transfer_banking_nick: result.transfer_banking_nick,
          transfer_date: moment(result.transfer_date).isValid()
            ? moment(result.transfer_date)
            : undefined,
          transfer_amount: result.transfer_amount,
          email: result.email,
          role: result.role,
        });
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      void fetchMember();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/members`,
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
  const handleEdit: FormProps<UserFormData>['onFinish'] = async (formData) => {
    try {
      setLoading(true);
      setShowExitPrompt(true);

      const editData: FormData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] || formData[key] === 0) {
          switch (key) {
            case 'img_profile':
              break;

            case 'img_nric':
              break;

            case 'birthday':
              editData.set(key, moment(formData[key]).format('YYYY-MM-DD'));
              break;

            case 'member_expire':
              if (formData[key])
                editData.set(key, moment(formData[key]).format('YYYY-MM-DD'));
              else editData.set(key, moment().format('YYYY-MM-DD'));
              break;
            case 'transfer_screenshot':
              break;

            case 'transfer_date':
              editData.set(key, moment(formData[key]).format('YYYY-MM-DD'));
              break;

            default:
              editData.set(key, formData[key] as string);
              break;
          }
        }
      });

      const { data } = await API.post<ResponseData<User>>(
        '/member/update',
        editData,
        {
          params: {
            user_id: id,
          },
        },
      );

      const uploadRequests: Promise<AxiosResponse>[] = [];

      if (formData.img_profile?.length === 1) {
        if (formData.img_profile[0].originFileObj) {
          const imgProfileFormData: FormData = new FormData();
          imgProfileFormData.set('user_id', String(data.data.user_id));
          imgProfileFormData.set('field', UserImg.PROFILE);
          imgProfileFormData.set('file', formData.img_profile[0].originFileObj);

          uploadRequests.push(
            API.post('/member/upload-doc', imgProfileFormData),
          );
        }
      }

      if (formData.img_nric?.length === 1) {
        if (formData.img_nric[0].originFileObj) {
          const imgNricFormData: FormData = new FormData();
          imgNricFormData.set('user_id', String(data.data.user_id));
          imgNricFormData.set('field', UserImg.NRIC);
          imgNricFormData.set('file', formData.img_nric[0].originFileObj);

          uploadRequests.push(API.post('/member/upload-doc', imgNricFormData));
        }
      }

      if (formData.transfer_screenshot?.length === 1) {
        if (formData.transfer_screenshot[0].originFileObj) {
          const transferScreenshotFormData: FormData = new FormData();
          transferScreenshotFormData.set('user_id', String(data.data.user_id));
          transferScreenshotFormData.set('field', UserImg.TRANSFER_SCREENSHOT);
          transferScreenshotFormData.set(
            'file',
            formData.transfer_screenshot[0].originFileObj,
          );

          uploadRequests.push(
            API.post('/member/upload-doc', transferScreenshotFormData),
          );
        }
      }

      if (uploadRequests.length > 0) {
        await Promise.all(uploadRequests);
      }

      notification.success({
        message: (
          <span>
            Edited user <strong>{data.data.fullname}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      const callbackURL = query.get('callback_url');

      if (callbackURL) {
        history.push({
          pathname: callbackURL,
        });
        return;
      }

      history.push({
        pathname: `${APP_PREFIX_PATH}/members`,
      });
      window.location.reload();
    } catch (err) {
      setLoading(false);
    }
  };
  const handleEditFailed: FormProps<UserFormData>['onFinishFailed'] = ({
    errorFields,
  }) => {
    const requiredFields: Record<string, Array<keyof UserFormData>> = {
      general: ['fullname'],
      emergency: ['mobile'],
      settings: ['email', 'role'],
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
      pathname: `${APP_PREFIX_PATH}/members`,
    });
  };

  const handleCancelChangePassword: MemberSettingsFormProps['onCancelChangePassword'] =
    () => {
      form.setFieldsValue({
        password: undefined,
        password_confirm: undefined,
      });
    };

  return !loading && user !== null ? (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='edit-user-form'
        className='ant-advanced-search-form'
        onFinish={handleEdit}
        onFinishFailed={handleEditFailed}
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
                  <h2 className='mb-3'>Edit Member</h2>
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
                  <MemberGeneralForm
                    imgProfile={form.getFieldsValue().img_profile}
                    imgNRIC={form.getFieldsValue().img_nric}
                  />
                </TabPane>
                <TabPane key='vehicle' tab='Vehicle' forceRender>
                  <MemberVehicleForm />
                </TabPane>
                <TabPane key='emergency' tab='Emergency' forceRender>
                  <MemberEmergencyForm />
                </TabPane>
                <TabPane key='transfer' tab='Transfer' forceRender>
                  <MemberTransferForm
                    transferScreenshot={
                      form.getFieldsValue().transfer_screenshot
                    }
                  />
                </TabPane>
                <TabPane key='settings' tab='Settings' forceRender>
                  <MemberSettingsForm
                    edit
                    onCancelChangePassword={handleCancelChangePassword}
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

export default MemberEditView;
/* eslint-enable */
