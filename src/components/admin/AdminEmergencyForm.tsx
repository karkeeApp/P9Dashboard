import { FC } from 'react';
import { Row, Col, Card, Form, Input, Select } from 'antd';

// Constants
import { CountryCodeOptions } from '@/constants';

// Custom Hooks
import { useGlobal } from '@/hooks';

const AdminEmergencyForm: FC = () => {
  const { options } = useGlobal();

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24}>
          <Card title='Emergency Info'>
            <Form.Item name='emergency_no' label='Emergency Number'>
              <Input />
            </Form.Item>
            <Form.Item name='contact_person' label='Contact Person'>
              <Input />
            </Form.Item>
            <Form.Item
              name='mobile'
              label='Mobile Number'
              rules={[
                { required: true, message: 'Please enter mobile number' },
                {
                  min: 8,
                  max: 8,
                  message: 'Mobile number must be 8 digits',
                },
              ]}
            >
              <Input
                addonBefore={
                  <Form.Item
                    name='mobile_code'
                    initialValue={
                      CountryCodeOptions.find((c) => c.key === 'Singapore')
                        ?.value
                    }
                    noStyle
                  >
                    <Select
                      optionLabelProp='value'
                      options={CountryCodeOptions}
                      style={{
                        minWidth: 70,
                      }}
                      dropdownStyle={{
                        minWidth: 385,
                      }}
                    />
                  </Form.Item>
                }
              />
            </Form.Item>
            <Form.Item name='relationship' label='Relationship'>
              <Select options={options.relationships} />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminEmergencyForm;
