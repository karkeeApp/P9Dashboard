import { FC, ReactNode } from 'react';
import { Row, Col, Card, Form, Input, Select } from 'antd';

// Constants
import { CountryOptions } from '@/constants';

export interface MemberDetailsFormProps {
  action: ReactNode;
}

const VendorMemberDetailsForm: FC<MemberDetailsFormProps> = ({ action }) => (
  <Row gutter={16} justify='center'>
    <Col xs={24} sm={24} md={12}>
      <Card>
        <Form.Item
          name='firstname'
          label='First Name'
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='lastname'
          label='Last Name'
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='about'
          label='About'
          rules={[{ required: true, message: 'Please enter about' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name='email'
          label='Email'
          rules={[
            { required: true, message: 'Please enter email address' },
            { type: 'email', message: 'Invalid email address' },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name='password'
          label='Password'
          rules={[
            { required: true, message: 'Please enter password' },
            { min: 6 },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name='mobile' label='Mobile'>
          <Input />
        </Form.Item>

        <Form.Item
          name='add_1'
          label='Address 1'
          rules={[{ required: true, message: 'Please enter address 1' }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item name='add_2' label='Address 2'>
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          name='postal_code'
          label='Postal Code'
          rules={[
            {
              required: true,
              message: 'Please enter postal code',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='country'
          label='Country'
          initialValue={
            CountryOptions.find((country) => country.value === 'Singapore')
              ?.value
          }
        >
          <Select options={CountryOptions} />
        </Form.Item>
      </Card>

      {action}
    </Col>
  </Row>
);

export default VendorMemberDetailsForm;
