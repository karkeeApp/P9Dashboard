import { FC, useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Descriptions,
  Upload,
  Tag,
  Form,
  FormProps,
  Button,
  Switch,
  InputNumber,
  notification,
} from 'antd';

// Types
import { Club, ClubSettingsFormData } from '@/types/club';

// API
import API from '@/api';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getClubStatusTagColor } from '@/utils/club';

// Components
import { CustomIcon } from '@/components/util';

export interface ClubGeneralDescriptionProps {
  club: Club;
}

const { Dragger } = Upload;

const ClubGeneralDescription: FC<ClubGeneralDescriptionProps> = ({ club }) => {
  const { settings } = useGlobal();
  const [form] = Form.useForm<ClubSettingsFormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [editingSettings, setEditingSettings] = useState<boolean>(false);

  useEffect(() => {
    form.setFieldsValue({
      club_code: club.club_code,
      is_one_approval: Boolean(club.is_one_approval),
      enable_ads: Boolean(club.enable_ads),
      skip_approval: Boolean(club.skip_approval),
      num_days_expiry: club.num_days_expiry,
      renewal_alert: club.renewal_alert,
    });
  }, [club]);

  const handleEditSettings: FormProps<ClubSettingsFormData>['onFinish'] =
    async (formData) => {
      try {
        setLoading(true);

        const editSettingsData: FormData = new FormData();
        editSettingsData.set('account_id', String(club.account_id));

        (Object.keys(formData) as Array<keyof ClubSettingsFormData>).forEach(
          (key) => {
            if (formData[key] === true) {
              editSettingsData.set(key, String(1));
            } else if (formData[key] === false) {
              editSettingsData.set(key, String(0));
            } else {
              editSettingsData.set(key, String(formData[key]));
            }
          },
        );

        await API.post('/account/update-default-settings', editSettingsData);

        notification.success({
          message: (
            <span>
              Edited settings on club <strong>{club.company}</strong>
            </span>
          ),
        });

        setLoading(false);
        setEditingSettings(false);
      } catch (err) {
        setLoading(false);
      }
    };
  const handleEditSettingsFieldsChange: FormProps<ClubSettingsFormData>['onFieldsChange'] =
    () => {
      setEditingSettings(true);
    };

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={17}>
          <Card title='Basic Info'>
            <Descriptions
              layout='vertical'
              column={1}
              bordered
              colon={false}
              labelStyle={{
                fontWeight: 'bold',
              }}
            >
              <Descriptions.Item label='Company'>
                {club.company}
              </Descriptions.Item>
              <Descriptions.Item label='Company Full Name'>
                {club.company_full_name}
              </Descriptions.Item>
              <Descriptions.Item label='Status'>
                <Tag color={getClubStatusTagColor(club.status)}>
                  {
                    settings.club_status.find((s) => s.value === club.status)
                      ?.label
                  }
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label='Address'>
                {club.address}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title='Contact Info'>
            <Descriptions
              layout='vertical'
              column={1}
              bordered
              colon={false}
              labelStyle={{
                fontWeight: 'bold',
              }}
            >
              <Descriptions.Item label='Contact Name'>
                {club.contact_name}
              </Descriptions.Item>
              <Descriptions.Item label='Email'>{club.email}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Card title='Logo'>
            <Dragger
              name='logo'
              disabled
              multiple={false}
              maxCount={1}
              listType='picture-card'
              showUploadList={false}
              beforeUpload={() => false}
              style={{
                background: 'unset',
              }}
            >
              {club.logo ? (
                <img
                  className='img-fluid'
                  src={club.logo_url}
                  alt={club.logo}
                />
              ) : (
                <div>
                  <div>
                    <CustomIcon className='display-3' svg={ImageSVG} />
                  </div>
                </div>
              )}
            </Dragger>
          </Card>

          <Form
            layout='vertical'
            form={form}
            name='add-club-form'
            className='ant-advanced-search-form'
            requiredMark={false}
            onFinish={handleEditSettings}
            onFieldsChange={handleEditSettingsFieldsChange}
          >
            {() => (
              <Card
                title='Settings'
                extra={
                  editingSettings ? (
                    <Button type='primary' htmlType='submit' size='small'>
                      Save
                    </Button>
                  ) : undefined
                }
              >
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24}>
                    <Form.Item name='club_code' label='Club Code'>
                      <InputNumber
                        className='w-100'
                        disabled={loading}
                        min={1}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name='renewal_alert'
                      label='Renewal Alert'
                      initialValue={30}
                    >
                      <InputNumber
                        className='w-100'
                        disabled={loading}
                        min={1}
                        addonAfter='Days'
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name='num_days_expiry'
                      label='Member Expiry'
                      initialValue={365}
                    >
                      <InputNumber
                        className='w-100'
                        disabled={loading}
                        min={1}
                        addonAfter='Days'
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name='is_one_approval'
                      valuePropName='checked'
                      label='Is One Approval'
                    >
                      <Switch disabled={loading} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name='enable_ads'
                      valuePropName='checked'
                      label='Enable Ads'
                    >
                      <Switch disabled={loading} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name='skip_approval'
                      valuePropName='checked'
                      label='Skip Approval'
                    >
                      <Switch disabled={loading} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            )}
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default ClubGeneralDescription;
