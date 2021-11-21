import { FC, useState, useCallback, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Upload,
  UploadProps,
  Switch,
  Input,
  DatePicker,
  InputNumber,
} from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import ReactQuill from 'react-quill';
import moment from 'moment';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Utils
import { normFile, getBase64 } from '@/utils/upload';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface EventGeneralFormProps {
  image: UploadProps['fileList'];
}

const EventGeneralForm: FC<EventGeneralFormProps> = ({ image }) => {
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
      <Col xs={24} sm={24} md={17}>
        <Card title='Basic Info'>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24}>
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

              <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    name='event_date'
                    label='Date'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter date',
                      },
                    ]}
                  >
                    <DatePicker
                      className='w-100'
                      format='YYYY-MM-DD HH:mm:ss'
                      placeholder='Select date'
                      showTime
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    name='cut_off_at'
                    label='Cut off'
                    dependencies={['event_date']}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter cut off',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            moment(value).isAfter(
                              moment(getFieldValue('event_date')),
                            )
                          ) {
                            return Promise.reject(
                              new Error(
                                'Cut off must be on or before event date',
                              ),
                            );
                          }

                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      className='w-100'
                      format='YYYY-MM-DD HH:mm:ss'
                      placeholder='Select cut off'
                      showTime
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12}>
                  <Form.Item name='limit' label='Limit'>
                    <InputNumber className='w-100' />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    name='event_fee'
                    label='Fee'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter fee',
                      },
                    ]}
                  >
                    <InputNumber className='w-100' />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
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
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name='is_public'
                valuePropName='checked'
                label='Is Public'
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item name='is_paid' valuePropName='checked' label='Is Paid'>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default EventGeneralForm;
