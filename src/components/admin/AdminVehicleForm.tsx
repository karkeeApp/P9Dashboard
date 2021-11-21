import { FC } from 'react';
import { Row, Col, Card, Form, Input, Select } from 'antd';

// Custom Hooks
import { useGlobal } from '@/hooks';

const AdminVehicleForm: FC = () => {
  const { options } = useGlobal();

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24}>
          <Card title='Vehicle Info'>
            <Form.Item name='chasis_number' label='Chassis Number'>
              <Input />
            </Form.Item>
            <Form.Item name='plate_no' label='Plate Number'>
              <Input />
            </Form.Item>
            <Form.Item name='car_model' label='Car Model'>
              <Input />
            </Form.Item>
            <Form.Item name='are_you_owner' label='Are you owner?'>
              <Select options={options.owner_options} />
            </Form.Item>
            <Form.Item name='registration_code' label='Registration Code'>
              <Input />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminVehicleForm;
