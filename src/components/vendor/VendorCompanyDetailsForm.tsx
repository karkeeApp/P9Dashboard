import { FC, ReactNode } from 'react';
import { Row, Col, Card, Form, Input, DatePicker } from 'antd';

export interface VendorCompanyDetailsFormProps {
  action: ReactNode;
}

const VendorCompanyDetailsForm: FC<VendorCompanyDetailsFormProps> = ({
  action,
}) => (
  <Row gutter={16} justify='center'>
    <Col xs={24} sm={24} md={12}>
      <Card>
        <Form.Item name='company' label='Company'>
          <Input />
        </Form.Item>

        <Form.Item
          name='founded_date'
          label='Founded Date'
          rules={[
            {
              required: true,
              message: 'Please enter founded date',
            },
          ]}
        >
          <DatePicker className='w-100' format='YYYY-MM-DD' />
        </Form.Item>

        <Form.Item name='profession' label='Profession'>
          <Input />
        </Form.Item>

        <Form.Item name='company_add_1' label='Address 1'>
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item name='company_add_2' label='Address 2'>
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item name='contact_person' label='Contact Person'>
          <Input />
        </Form.Item>
      </Card>

      {action}
    </Col>
  </Row>
);

export default VendorCompanyDetailsForm;
