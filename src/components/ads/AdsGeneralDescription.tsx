import { FC, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Descriptions,
  Tag,
  Upload,
  Form,
  Input,
  Switch,
} from 'antd';

// Types
import { Ads, AdsFormData } from '@/types/ads';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getAdsStatusTagColor } from '@/utils/ads';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface AdsGeneralDescriptionProps {
  ads: Ads;
}

const AdsGeneralDescription: FC<AdsGeneralDescriptionProps> = ({ ads }) => {
  const { settings } = useGlobal();
  const [form] = Form.useForm<AdsFormData>();

  useEffect(() => {
    form.setFieldsValue({
      link: ads.link,
      is_bottom: Boolean(ads.is_bottom),
    });
  }, [ads]);

  return (
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
            <Descriptions.Item label='Title'>{ads.title}</Descriptions.Item>
            <Descriptions.Item label='Summary'>{ads.summary}</Descriptions.Item>
            <Descriptions.Item label='Status'>
              <Tag color={getAdsStatusTagColor(ads.status)}>
                {settings.ads_status.find((s) => s.value === ads.status)?.label}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>

      <Col xs={24} sm={24} md={7}>
        <Card title='Image'>
          <Dragger
            name='image'
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
            {ads.file ? (
              <img className='img-fluid' src={ads.file} alt={ads.title} />
            ) : (
              <div>
                <div>
                  <CustomIcon className='display-3' svg={ImageSVG} />
                </div>
              </div>
            )}
          </Dragger>
        </Card>

        <Card title='Publication'>
          <Form name='ads-publication-form' layout='vertical' form={form}>
            <Form.Item
              name='link'
              label='Link'
              rules={[
                {
                  required: true,
                  message: 'Please enter ads URL',
                },
              ]}
            >
              <Input disabled className='w-100' />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name='is_bottom'
                  valuePropName='checked'
                  label='Is Bottom'
                >
                  <Switch disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default AdsGeneralDescription;
