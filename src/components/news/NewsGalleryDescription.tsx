import { FC } from 'react';
import { Row, Col, Card, Image } from 'antd';

// Types
import { News } from '@/types/news';

export interface NewsGalleryDescriptionProps {
  galleries: News['galleries'];
}

const NewsGalleryDescription: FC<NewsGalleryDescriptionProps> = ({
  galleries,
}) => (
  <Row gutter={16}>
    <Col xs={24} sm={24} md={24}>
      <Card title='News Gallery'>
        <Image.PreviewGroup>
          {galleries.map((gallery) => (
            <Image src={gallery.url} alt={gallery.url} />
          ))}
        </Image.PreviewGroup>
      </Card>
    </Col>
  </Row>
);

export default NewsGalleryDescription;
