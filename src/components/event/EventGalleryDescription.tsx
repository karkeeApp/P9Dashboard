import { FC } from 'react';
import { Row, Col, Card, Image } from 'antd';

// Types
import { Event } from '@/types/event';

export interface EventGalleryDescriptionProps {
  galleries: Event['galleries'];
}

const EventGalleryDescription: FC<EventGalleryDescriptionProps> = ({
  galleries,
}) => (
  <Row gutter={16}>
    <Col xs={24} sm={24} md={24}>
      <Card title='Event Gallery'>
        <Image.PreviewGroup>
          {galleries.map((gallery) => (
            <Image src={gallery.url} alt={gallery.url} />
          ))}
        </Image.PreviewGroup>
      </Card>
    </Col>
  </Row>
);

export default EventGalleryDescription;
