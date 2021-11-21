import { FC, ReactNode } from 'react';
import { Row, Col, Card, Form, Input } from 'antd';

export interface VendorEmailCheckingFormProps {
  action: ReactNode;
  errorMessage?: string;
}

const VendorEmailCheckingForm: FC<VendorEmailCheckingFormProps> = ({
  action,
  errorMessage,
}) => (
  <Row gutter={16} justify='center'>
    <Col xs={24} sm={24} md={7}>
      <Card>
        <Form.Item
          name='email'
          label='Email'
          rules={[{ required: true, whitespace: true, type: 'email' }]}
          validateStatus={errorMessage ? 'error' : undefined}
          help={errorMessage}
        >
          <Input />
        </Form.Item>

        {action}
      </Card>
    </Col>
  </Row>
);

export default VendorEmailCheckingForm;
