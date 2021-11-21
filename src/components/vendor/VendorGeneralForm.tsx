import { FC } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
} from 'antd';

// Constants
import { CountryOptions } from '@/constants';

const VendorGeneralForm: FC = () => (
  <Row gutter={16}>
    <Col xs={24} sm={24} md={24}>
      <Card title='Basic Info'>
        <Form.Item
          name='vendor_name'
          label='Vendor Name'
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Please enter vendor name',
            },
          ]}
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
          name='founded_date'
          label='Founded Data'
          rules={[
            {
              required: true,
              message: 'Please enter founded date',
            },
          ]}
        >
          <DatePicker className='w-100' format='YYYY-MM-DD' />
        </Form.Item>

        <Form.Item name='add_1' label='Address 1'>
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item name='add_2' label='Address 2'>
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item name='postal_code' label='Postal Code'>
          <InputNumber
            className='w-100'
            controls={false}
            minLength={6}
            maxLength={6}
          />
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
    </Col>
  </Row>
);

export default VendorGeneralForm;
