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
import { getBase64 } from '@/utils/upload';

// Components
import { PageHeaderAlt } from '@/components/layout';
import { Flex, Loading } from '@/components/shared';
import { LeavePrompt } from '@/components/util';
import { UserVehicleForm, UserEmergencyForm } from '@/components/user';
import UserGeneralForm, {
  UserGeneralFormProps,
} from '@/components/user/UserGeneralForm';
import UserTransferForm, {
  UserTransferFormProps,
} from '@/components/user/UserTransferForm';
import UserSettingsForm, {
  UserSettingsFormProps,
} from '@/components/user/UserSettingsForm';

const { TabPane } = Tabs;

const UserEditView: FC<RouteComponentProps<{ id: string }>> = ({
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
  const [imgProfile, setImgProfile] = useState<
    UserGeneralFormProps['imgProfile']
  >([]);
  const [imgNRIC, setImgNRIC] = useState<UserGeneralFormProps['imgNRIC']>([]);
  const [transferScreenshot, setTransferScreenshot] = useState<
    UserTransferFormProps['transferScreenshot']
  >([]);

  const fetchUser = useCallback(async () => {
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
          relationship: result.relationship,
          transfer_no: result.transfer_no,
          transfer_banking_nick: result.transfer_banking_nick,
          transfer_date: moment(result.transfer_date).isValid()
            ? moment(result.transfer_date)
            : undefined,
          transfer_amount: result.transfer_amount,
          email: result.email,
          role: result.role,
        });

        if (result.img_profile) {
          setImgProfile([
            { url: result.img_profile, name: result.fullname } as UploadFile,
          ]);
        }

        if (result.img_nric) {
          setImgNRIC([
            {
              url: result.img_nric,
              name: `${result.fullname} - ${result.nric}`,
            } as UploadFile,
          ]);
        }

        if (result.transfer_screenshot) {
          setTransferScreenshot([
            {
              url: result.transfer_screenshot,
              name: `${result.fullname} - ${result.transfer_no}`,
            } as UploadFile,
          ]);
        }
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchUser();
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
            case 'birthday':
              editData.set(key, moment(formData[key]).format('YYYY-MM-DD'));
              break;

            case 'member_expire':
              if (formData[key])
                editData.set(key, moment(formData[key]).format('YYYY-MM-DD'));
              else editData.set(key, moment().format('YYYY-MM-DD'));
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

      if (imgProfile && imgProfile.length > 0) {
        const imgProfileFormData: FormData = new FormData();
        imgProfileFormData.set('user_id', String(data.data.user_id));
        imgProfileFormData.set('field', UserImg.PROFILE);

        const imgProfileFetchRes = await fetch(imgProfile[0].url as string);
        const imgProfileBlob = await imgProfileFetchRes.blob();

        imgProfileFormData.set('file', imgProfileBlob);

        uploadRequests.push(API.post('/member/upload-doc', imgProfileFormData));
      }

      if (imgNRIC && imgNRIC.length > 0) {
        const imgNricFormData: FormData = new FormData();
        imgNricFormData.set('user_id', String(data.data.user_id));
        imgNricFormData.set('field', UserImg.NRIC);

        const imgNricFetchRes = await fetch(imgNRIC[0].url as string);
        const imgNricBlob = await imgNricFetchRes.blob();

        imgNricFormData.set('file', imgNricBlob);

        uploadRequests.push(API.post('/member/upload-doc', imgNricFormData));
      }

      if (transferScreenshot && transferScreenshot.length > 0) {
        const transferScreenshotFormData: FormData = new FormData();
        transferScreenshotFormData.set('user_id', String(data.data.user_id));
        transferScreenshotFormData.set('field', UserImg.TRANSFER_SCREENSHOT);

        const transferScreenshotFetchRes = await fetch(
          transferScreenshot[0].url as string,
        );
        const transferScreenshotBlob = await transferScreenshotFetchRes.blob();

        transferScreenshotFormData.set('file', transferScreenshotBlob);

        uploadRequests.push(
          API.post('/member/upload-doc', transferScreenshotFormData),
        );
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

      history.push({
        pathname: `${APP_PREFIX_PATH}/users`,
      });
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
      pathname: `${APP_PREFIX_PATH}/users`,
    });
  };

  // Upload Change Handlers
  const handleChangeImgProfile: UserGeneralFormProps['onChangeImgProfile'] =
    async (e) => {
      if (e.fileList[0].originFileObj) {
        setImgProfile([
          {
            name: user?.fullname,
            url: await getBase64(e.fileList[0].originFileObj),
          } as UploadFile,
        ]);
      }
    };
  const handleChangeImgNRIC: UserGeneralFormProps['onChangeImgNRIC'] = async (
    e,
  ) => {
    if (e.fileList[0].originFileObj) {
      setImgNRIC([
        {
          name: `${String(user?.fullname)} - ${String(user?.nric)}`,
          url: await getBase64(e.fileList[0].originFileObj),
        } as UploadFile,
      ]);
    }
  };
  const handleChangeTransferScreenshot: UserTransferFormProps['onChangeTransferScreenshot'] =
    async (e) => {
      if (e.fileList[0].originFileObj) {
        setTransferScreenshot([
          {
            name: `${String(user?.fullname)} - ${String(user?.transfer_no)}`,
            url: await getBase64(e.fileList[0].originFileObj),
          } as UploadFile,
        ]);
      }
    };

  // Field Handlers
  const handleCancelChangePassword: UserSettingsFormProps['onCancelChangePassword'] =
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
                  <h2 className='mb-3'>Edit User</h2>
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
                  <UserGeneralForm
                    edit
                    imgProfile={imgProfile}
                    imgNRIC={imgNRIC}
                    onChangeImgProfile={handleChangeImgProfile}
                    onChangeImgNRIC={handleChangeImgNRIC}
                  />
                </TabPane>
                <TabPane key='vehicle' tab='Vehicle' forceRender>
                  <UserVehicleForm />
                </TabPane>
                <TabPane key='emergency' tab='Emergency' forceRender>
                  <UserEmergencyForm />
                </TabPane>
                <TabPane key='transfer' tab='Transfer' forceRender>
                  <UserTransferForm
                    edit
                    transferScreenshot={transferScreenshot}
                    onChangeTransferScreenshot={handleChangeTransferScreenshot}
                  />
                </TabPane>
                <TabPane key='settings' tab='Settings' forceRender>
                  <UserSettingsForm
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

export default UserEditView;
