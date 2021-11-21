import { FC, useEffect } from 'react';
import { Row, Col, Card, Descriptions, Tag, Upload, Form, Switch } from 'antd';
import moment from 'moment';

// Types
import { Event, EventFormData } from '@/types/event';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getEventStatusTagColor } from '@/utils/event';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface EventGeneralDescriptionProps {
  event: Event;
}

const EventGeneralDescription: FC<EventGeneralDescriptionProps> = ({
  event,
}) => {
  const { settings } = useGlobal();
  const [form] = Form.useForm<EventFormData>();

  useEffect(() => {
    form.setFieldsValue({
      is_public: Boolean(event.is_public),
      is_paid: Boolean(event.is_paid),
    });
  }, [event]);

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
            <Descriptions.Item label='Title'>{event.title}</Descriptions.Item>
            <Descriptions.Item label='Summary'>
              {event.summary}
            </Descriptions.Item>
            <Descriptions.Item label='Date'>
              {moment(event.event_date).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label='Cut off'>
              {moment(event.cut_off_at).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label='Limit'>{event.limit}</Descriptions.Item>
            <Descriptions.Item label='Fee'>{event.event_fee}</Descriptions.Item>
            <Descriptions.Item label='Status'>
              <Tag color={getEventStatusTagColor(event.status)}>
                {
                  settings.event_status.find((s) => s.value === event.status)
                    ?.label
                }
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title='Content'>
          <div
            dangerouslySetInnerHTML={{
              __html: event.content,
            }}
          />
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
            {event.image ? (
              <img className='img-fluid' src={event.image} alt={event.title} />
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
          <Form name='event-publication-form' layout='vertical' form={form}>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name='is_public'
                  valuePropName='checked'
                  label='Is Public'
                >
                  <Switch disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name='is_paid'
                  valuePropName='checked'
                  label='Is Paid'
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

export default EventGeneralDescription;
