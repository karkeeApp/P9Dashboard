import { FC, useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Form, Input, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

// Types
import { ListingFormData } from '@/types/listing';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Utils
import { normFile, getBase64 } from '@/utils/upload';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface ListingGeneralFormProps {
  image: ListingFormData['image'];
}

const ListingGeneralForm: FC<ListingGeneralFormProps> = ({ image }) => {
  const [imageThumbnail, setImageThumbnail] = useState<typeof image>([]);

  const getPrimaryPhotoThumbnail = useCallback(async () => {
    if (image && image.length > 0) {
      if (image[0].url) {
        setImageThumbnail(image);
      } else if (image[0].originFileObj) {
        const primaryPhotoThumbnailURL = await getBase64(
          image[0].originFileObj,
        );
        setImageThumbnail([
          {
            name: image[0].name,
            url: primaryPhotoThumbnailURL as string,
          } as UploadFile,
        ]);
      }
    }
  }, [image]);

  useEffect(() => {
    void getPrimaryPhotoThumbnail();
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
                  message: 'Please enter listing title',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='content'
              label='Content'
              rules={[
                {
                  required: true,
                  message: 'Please enter listing content',
                },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Card title='Primary Photo'>
            <Form.Item
              name='image'
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

export default ListingGeneralForm;
