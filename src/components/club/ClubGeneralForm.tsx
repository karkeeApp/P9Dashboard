import { FC, useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Form, Input, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

// Types
import { ClubFormData } from '@/types/club';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Utils
import { normFile, getBase64 } from '@/utils/upload';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface ClubGeneralFormProps {
  logo: ClubFormData['logo'];
}

const ClubGeneralForm: FC<ClubGeneralFormProps> = ({ logo }) => {
  const [logoThumbnail, setLogoThumbnail] = useState<typeof logo>([]);

  const getLogoThumbnail = useCallback(async () => {
    if (logo && logo.length > 0) {
      if (logo[0].url) {
        setLogoThumbnail(logo);
      } else if (logo[0].originFileObj) {
        const logoThumbnailURL = await getBase64(logo[0].originFileObj);
        setLogoThumbnail([
          {
            name: logo[0].name,
            url: logoThumbnailURL as string,
          } as UploadFile,
        ]);
      }
    }
  }, [logo]);

  useEffect(() => {
    void getLogoThumbnail();
  }, [logo]);

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={17}>
          <Card title='Basic Info'>
            <Form.Item
              name='company'
              label='Company'
              rules={[
                {
                  required: true,
                  message: 'Please enter company',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='company_full_name'
              label='Company Full Name'
              rules={[
                {
                  required: true,
                  message: 'Please enter company full name',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name='address' label='Address'>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Card>

          <Card title='Contact Info'>
            <Form.Item name='contact_name' label='Contact Name'>
              <Input />
            </Form.Item>
            <Form.Item name='email' label='Email' rules={[{ type: 'email' }]}>
              <Input />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Card title='Logo'>
            <Form.Item
              name='logo'
              valuePropName='fileList'
              getValueFromEvent={normFile}
              style={{
                marginBottom: 0,
              }}
            >
              <Dragger
                multiple={false}
                maxCount={1}
                listType='picture-card'
                showUploadList={false}
                beforeUpload={() => false}
                style={{
                  background: 'unset',
                }}
              >
                {logoThumbnail && logoThumbnail.length > 0 ? (
                  <img
                    className='img-fluid'
                    src={logoThumbnail[0].url}
                    alt={logoThumbnail[0].name}
                  />
                ) : (
                  <div>
                    <div>
                      <CustomIcon className='display-3' svg={ImageSVG} />
                      <p>Click or drag file to upload</p>
                    </div>
                  </div>
                )}
              </Dragger>
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ClubGeneralForm;
