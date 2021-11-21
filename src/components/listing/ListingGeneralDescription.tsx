import { FC } from 'react';
import { Row, Col, Card, Descriptions, Tag, Upload } from 'antd';

// Types
import { Listing } from '@/types/listing';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getListingStatusTagColor } from '@/utils/listing';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface ListingGeneralDescriptionProps {
  listing: Listing;
}

const ListingGeneralDescription: FC<ListingGeneralDescriptionProps> = ({
  listing,
}) => {
  const { settings } = useGlobal();

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
            <Descriptions.Item label='Title'>{listing.title}</Descriptions.Item>
            <Descriptions.Item label='Content'>
              {listing.content}
            </Descriptions.Item>
            <Descriptions.Item label='Status'>
              <Tag color={getListingStatusTagColor(listing.status)}>
                {
                  settings.listing_status.find(
                    (s) => s.value === listing.status,
                  )?.label
                }
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>

      <Col xs={24} sm={24} md={7}>
        <Card title='Primary Photo'>
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
            {listing.image ? (
              <img
                className='img-fluid'
                src={listing.image}
                alt={listing.title}
              />
            ) : (
              <div>
                <div>
                  <CustomIcon className='display-3' svg={ImageSVG} />
                </div>
              </div>
            )}
          </Dragger>
        </Card>
      </Col>
    </Row>
  );
};

export default ListingGeneralDescription;
