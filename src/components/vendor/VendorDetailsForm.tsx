import { FC, ReactNode } from 'react';
import { Row, Col, Card, Form, Input } from 'antd';

export interface VendorDetailsFormProps {
  action: ReactNode;
}

const VendorDetailsForm: FC<VendorDetailsFormProps> = ({ action }) => (
  <Row gutter={16} justify='center'>
    <Col xs={24} sm={24} md={12}>
      <Card>
        <Form.Item
          name='vendor_name'
          label='Vendor Name'
          rules={[{ required: true, message: 'Please enter vendor name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name='vendor_description' label='Description'>
          <Input.TextArea rows={4} />
        </Form.Item>
      </Card>

      {action}
    </Col>
  </Row>
);

export default VendorDetailsForm;
