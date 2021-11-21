import { FC } from 'react';
import { Row, Col, Card, Descriptions } from 'antd';

// Types
import { User } from '@/types/user';

// Custom Hooks
import { useGlobal } from '@/hooks';

export interface UserEmergencyDescriptionProps {
  user: User;
}

const UserEmergencyDescription: FC<UserEmergencyDescriptionProps> = ({
  user,
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
                {user.emergency_no}
              </Descriptions.Item>
              <Descriptions.Item label='Contact Person'>
                {user.contact_person}
              </Descriptions.Item>
              <Descriptions.Item label='Mobile Code'>
                {user.mobile_code}
              </Descriptions.Item>
              <Descriptions.Item label='Mobile Number'>
                {user.mobile}
              </Descriptions.Item>
              <Descriptions.Item label='Relationship'>
                {
                  options.relationships.find(
                    (r) => r.value === user.relationship,
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

export default UserEmergencyDescription;
