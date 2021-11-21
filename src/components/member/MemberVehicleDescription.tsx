import { FC } from 'react';
import { Row, Col, Card, Descriptions } from 'antd';

// Types
import { User } from '@/types/user';

// Custom Hooks
import { useGlobal } from '@/hooks';

export interface MemberVehicleDescriptionProps {
  member: User;
}

const MemberVehicleDescription: FC<MemberVehicleDescriptionProps> = ({
  member,
}) => {
  const { options } = useGlobal();

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24}>
          <Card title='Vehicle Info'>
            <Descriptions
              layout='vertical'
              column={1}
              bordered
              colon={false}
              labelStyle={{
                fontWeight: 'bold',
              }}
            >
              <Descriptions.Item label='Chassis Number'>
                {member.chasis_number}
              </Descriptions.Item>
              <Descriptions.Item label='Plate Number'>
                {member.plate_no}
              </Descriptions.Item>
              <Descriptions.Item label='Car Model'>
                {member.car_model}
              </Descriptions.Item>
              <Descriptions.Item label='Are you owner?'>
                {
                  options.owner_options.find(
                    (o) => o.value === member.are_you_owner,
                  )?.label
                }
              </Descriptions.Item>
              <Descriptions.Item label='Registration Code'>
                {member.registration_code}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default MemberVehicleDescription;
