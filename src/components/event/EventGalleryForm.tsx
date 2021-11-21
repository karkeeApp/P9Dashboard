import { FC, useState } from 'react';
import { Row, Col, Card, Form, Upload, UploadProps, Modal } from 'antd';
import clsx from 'clsx';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Utils
import { normFile, getBase64 } from '@/utils/upload';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface EventGalleryFormProps {
  onRemove?: UploadProps['onRemove'];
}

const EventGalleryForm: FC<EventGalleryFormProps> = ({ onRemove }) => {
  // Preview Image States
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewImageTitle, setPreviewImageTitle] = useState<string>('');
  const [previewImageVisible, setPreviewImageVisible] =
    useState<boolean>(false);

  // Preview Image Handlers
  const handlePreviewImage: UploadProps['onPreview'] = async (file) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }

    setPreviewImage((file.url || file.preview) as string);
    setPreviewImageVisible(true);
    setPreviewImageTitle(
      file.name ||
        (file.url as string).substring(
          (file.url as string).lastIndexOf('/') + 1,
        ),
    );
  };
  const handleCancelPreviewImage = () => {
    setPreviewImageVisible(false);
  };

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24}>
          <Card title='Event Gallery'>
            <Form.Item
              name='galleries'
              valuePropName='fileList'
              getValueFromEvent={normFile}
              style={{
                marginBottom: 0,
              }}
            >
              <Dragger
                className={clsx('w-100', 'mb-3')}
                multiple
                listType='picture-card'
                beforeUpload={() => false}
                onRemove={onRemove}
                onPreview={handlePreviewImage}
                style={{
                  background: 'unset',
                }}
              >
                <div>
                  <div>
                    <CustomIcon className='display-3' svg={ImageSVG} />
                    <p>Click or drag file to upload</p>
                  </div>
                </div>
              </Dragger>
            </Form.Item>
          </Card>
        </Col>
      </Row>

      {/* Image Preview Modal */}
      <Modal
        visible={previewImageVisible}
        title={previewImageTitle}
        footer={null}
        onCancel={handleCancelPreviewImage}
      >
        <img className='w-100' src={previewImage} alt={previewImageTitle} />
      </Modal>
    </>
  );
};

export default EventGalleryForm;
