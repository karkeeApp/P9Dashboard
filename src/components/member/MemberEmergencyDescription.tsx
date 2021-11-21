import { FC } from 'react';
import { Row, Col, Card, Descriptions } from 'antd';

// Types
import { User } from '@/types/user';

// Custom Hooks
import { useGlobal } from '@/hooks';

export interface MemberEmergencyDescriptionProps {
  member: User;
}

const MemberEmergencyDescription: FC<MemberEmergencyDescriptionProps> = ({
  member,
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
                {member.emergency_no}
              </Descriptions.Item>
              <Descriptions.Item label='Contact Person'>
                {member.contact_person}
              </Descriptions.Item>
              <Descriptions.Item label='Mobile Code'>
                {member.mobile_code}
              </Descriptions.Item>
              <Descriptions.Item label='Mobile Number'>
                {member.mobile}
              </Descriptions.Item>
              <Descriptions.Item label='Relationship'>
                {
                  options.relationships.find(
                    (r) => r.value === member.relationship,
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

export default MemberEmergencyDescription;
