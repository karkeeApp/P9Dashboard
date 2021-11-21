import { FC, useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Upload,
  Select,
  SelectProps,
  Switch,
  Tag,
  TagProps,
} from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import ReactQuill from 'react-quill';

// Types
import { Option } from '@/types';
import { NewsFormData } from '@/types/news';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { normFile, getBase64 } from '@/utils/upload';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

const NewsCategoryTag: SelectProps<Option<number>>['tagRender'] = ({
  label,
  closable,
  onClose,
}) => {
  const handleMouseDown: TagProps['onMouseDown'] = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color='blue'
      onMouseDown={handleMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

export interface NewsGeneralFormProps {
  image: NewsFormData['image'];
}

const NewsGeneralForm: FC<NewsGeneralFormProps> = ({ image }) => {
  const { settings } = useGlobal();
  const [imageThumbnail, setImageThumbnail] = useState<typeof image>([]);

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
              rules={[{ required: true, message: 'Please enter title' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name='summary'
              label='Summary'
              rules={[{ required: true, message: 'Please enter summary' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Card>

          <Card title='Content'>
            <Form.Item
              name='content'
              rules={[{ required: true, message: 'Please enter content' }]}
            >
              <ReactQuill theme='snow' />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Card title='Image'>
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

          <Card title='Publication'>
            <Form.Item name='categories' label='Categories'>
              <Select
                className='w-100'
                mode='multiple'
                showArrow
                showSearch={false}
                tagRender={NewsCategoryTag}
                options={settings.news_categories}
              />
            </Form.Item>
            <Form.Item
              name='is_public'
              valuePropName='checked'
              label='Visibility'
            >
              <Switch checkedChildren='Public' unCheckedChildren='Private' />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default NewsGeneralForm;
