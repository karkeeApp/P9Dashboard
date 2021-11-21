import { FC, useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Form, Input, Upload, UploadProps, Switch } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import ReactQuill from 'react-quill';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Utils
import { normFile, getBase64 } from '@/utils/upload';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface BannerGeneralFormProps {
  image: UploadProps['fileList'];
}

const BannerGeneralForm: FC<BannerGeneralFormProps> = ({ image }) => {
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
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24}>
        <Card title='Image'>
          <Form.Item
            name='image'
            valuePropName='fileList'
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Please upload banner image' }]}
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

      <Col xs={24} sm={24} md={17}>
        <Card title='Basic Info'>
          <Form.Item
            name='title'
            label='Title'
            rules={[
              {
                required: true,
                message: 'Please enter banner title',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Card>

        <Card title='Content'>
          <Form.Item name='content'>
            <ReactQuill theme='snow' />
          </Form.Item>
        </Card>
      </Col>

      <Col xs={24} sm={24} md={7}>
        <Card title='Settings'>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                name='status'
                label='Visibility'
                valuePropName='checked'
              >
                <Switch checkedChildren='On' unCheckedChildren='Off' />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default BannerGeneralForm;
