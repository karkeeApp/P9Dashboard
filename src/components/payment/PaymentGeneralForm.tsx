import { FC, useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  UploadProps,
} from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { normFile, getBase64 } from '@/utils/upload';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface PaymentGeneralFormProps {
  image: UploadProps['fileList'];
}

const PaymentGeneralForm: FC<PaymentGeneralFormProps> = ({ image }) => {
  const { settings } = useGlobal();
  const [imageThumbnail, setImageThumbnail] = useState<UploadProps['fileList']>(
    [],
  );

  const getImageThumbnail = useCallback(async () => {
    if (image && image.length > 0) {
      if (image[0].url) {
        setImageThumbnail(image);
      } else if (image[0].originFileObj) {
        const imageThumbnailURL = await getBase64(image[0].originFileObj);
        setImageThumbnail([
          {
            name: image[0].name,
            url: imageThumbnailURL as string,
          } as UploadFile,
        ]);
      }
    }
  }, [image]);

  useEffect(() => {
    void getImageThumbnail();
  }, [image]);

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={17}>
          <Card title='Basic Info'>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  name='name'
                  label='Name'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter payment name',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name='amount'
                      label='Amount'
                      rules={[
                        {
                          required: true,
                          message: 'Please enter payment amount',
                        },
                      ]}
                    >
                      <InputNumber className='w-100' min={1} addonBefore='S$' />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name='payment_for'
                      label='Payment For'
                      rules={[
                        {
                          required: true,
                          message: 'Please select payment for',
                        },
                      ]}
                    >
                      <Select options={settings.payment_for} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Card title='Image'>
            <Form.Item
              name='image'
              valuePropName='fileList'
              getValueFromEvent={normFile}
              rules={[
                { required: true, message: 'Please upload payment image' },
              ]}
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
                {imageThumbnail && imageThumbnail.length > 0 ? (
                  <img
                    className='img-fluid'
                    src={imageThumbnail[0].url}
                    alt={imageThumbnail[0].name}
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

export default PaymentGeneralForm;
