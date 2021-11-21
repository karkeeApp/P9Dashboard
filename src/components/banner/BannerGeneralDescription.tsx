import { FC, useEffect } from 'react';
import { Row, Col, Card, Descriptions, Form, Upload, Switch } from 'antd';

// Types
import { Banner, BannerFormData } from '@/types/banner';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Components
import { CustomIcon } from '@/components/util';

export interface BannerGeneralDescriptionProps {
  banner: Banner;
}

const { Dragger } = Upload;

const BannerGeneralDescription: FC<BannerGeneralDescriptionProps> = ({
  banner,
}) => {
  const [form] = Form.useForm<BannerFormData>();

  useEffect(() => {
    form.setFieldsValue({
      status: Boolean(banner.status),
    });
  }, [banner]);

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24}>
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
            {banner.image ? (
              <img
                className='img-fluid'
                src={banner.image}
                alt={banner.filename}
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
      </Col>

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
            <Descriptions.Item label='Title'>{banner.title}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title='Content'>
          <div
            dangerouslySetInnerHTML={{
              __html: banner.content,
            }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={24} md={7}>
        <Card title='Settings'>
          <Form name='banner-settings-form' layout='vertical' form={form}>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name='status'
                  label='Visibility'
                  valuePropName='checked'
                >
                  <Switch
                    disabled
                    checkedChildren='On'
                    unCheckedChildren='Off'
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default BannerGeneralDescription;
