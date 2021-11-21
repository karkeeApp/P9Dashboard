import { FC } from 'react';
import { Row, Col, Card, Image } from 'antd';

// Types
import { Listing } from '@/types/listing';

export interface ListingGalleryDescriptionProps {
  gallery: Listing['gallery'];
}

const ListingGalleryDescription: FC<ListingGalleryDescriptionProps> = ({
  gallery,
}) => (
  <Row gutter={16}>
    <Col xs={24} sm={24} md={24}>
      <Card title='Listing Gallery'>
        <Image.PreviewGroup>
          {gallery.map((g) => (
            <Image src={g.url} alt={g.url} />
          ))}
        </Image.PreviewGroup>
      </Card>
    </Col>
  </Row>
);

export default ListingGalleryDescription;
