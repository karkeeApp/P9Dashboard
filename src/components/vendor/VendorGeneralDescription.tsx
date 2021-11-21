import { FC } from 'react';
import { Row, Col, Card, Descriptions, Tag } from 'antd';
import moment from 'moment';

// Types
import { Vendor } from '@/types/vendor';

// Constants
import { CountryOptions } from '@/constants';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getUserStatusTagColor } from '@/utils/user';

export interface VendorGeneralDescriptionProps {
  vendor: Vendor;
}

const VendorGeneralDescription: FC<VendorGeneralDescriptionProps> = ({
  vendor,
}) => {
  const { settings } = useGlobal();

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24}>
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
            <Descriptions.Item label='Vendor Name'>
              {vendor.vendor_name}
            </Descriptions.Item>
            <Descriptions.Item label='Status'>
              <Tag color={getUserStatusTagColor(vendor.status)}>
                {
                  settings.user_status.find((s) => s.value === vendor.status)
                    ?.label
                }
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='About'>{vendor.about}</Descriptions.Item>
            <Descriptions.Item label='Founded Date'>
              {moment(vendor.founded_date).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label='Address 1'>
              {vendor.add_1}
            </Descriptions.Item>
            <Descriptions.Item label='Address 2'>
              {vendor.add_2}
            </Descriptions.Item>
            <Descriptions.Item label='Postal Code'>
              {vendor.postal_code}
            </Descriptions.Item>
            <Descriptions.Item label='Country'>
              {CountryOptions.find((c) => c.value === vendor.country)?.label}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
};

export default VendorGeneralDescription;
