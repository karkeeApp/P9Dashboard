import { FC, useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Form, Input, Upload, UploadProps, Switch } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Utils
import { normFile, getBase64 } from '@/utils/upload';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface AdsGeneralFormProps {
  image: UploadProps['fileList'];
}

const AdsGeneralForm: FC<AdsGeneralFormProps> = ({ image }) => {
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
            <Form.Item
              name='title'
              label='Title'
              rules={[
                {
                  required: true,
                  message: 'Please enter ads title',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='summary'
              label='Summary'
              rules={[
                {
                  required: true,
                  message: 'Please enter ads summary',
                },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Card title='Image'>
            <Form.Item
              name='file'
              valuePropName='fileList'
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Please upload ads image' }]}
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

          <Card title='Publication'>
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
              <Input className='w-100' />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name='is_bottom'
                  valuePropName='checked'
                  label='Is Bottom'
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdsGeneralForm;
