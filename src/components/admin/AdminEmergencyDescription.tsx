import { FC } from 'react';
import { Row, Col, Card, Descriptions } from 'antd';

// Types
import { User } from '@/types/user';

// Custom Hooks
import { useGlobal } from '@/hooks';

export interface AdminEmergencyDescriptionProps {
  admin: User;
}

const AdminEmergencyDescription: FC<AdminEmergencyDescriptionProps> = ({
  admin,
}) => {
  const { options } = useGlobal();

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24}>
          <Card title='Emergency Info'>
            <Descriptions
              layout='vertical'
              column={1}
              bordered
              colon={false}
              labelStyle={{
                fontWeight: 'bold',
              }}
            >
              <Descriptions.Item label='Emergency Number'>
                {admin.emergency_no}
              </Descriptions.Item>
              <Descriptions.Item label='Contact Person'>
                {admin.contact_person}
              </Descriptions.Item>
              <Descriptions.Item label='Mobile Code'>
                {admin.mobile_code}
              </Descriptions.Item>
              <Descriptions.Item label='Mobile Number'>
                {admin.mobile}
              </Descriptions.Item>
              <Descriptions.Item label='Relationship'>
                {
                  options.relationships.find(
                    (r) => r.value === admin.relationship,
                  )?.label
                }
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminEmergencyDescription;
