import { FC } from 'react';
import { Row, Col, Card, Form, Button, Input, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export interface ClubSecurityQuestionsFormProps {
  onRemove?: (index: number) => Promise<void> | void;
}

const ClubSecurityQuestionsForm: FC<ClubSecurityQuestionsFormProps> = ({
  onRemove,
}) => (
  <>
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24}>
        <Card>
          <Form.List name='security_questions'>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={16} align='middle'>
                    <Col xs={20} sm={20} md={20}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'question']}
                        fieldKey={[field.key, 'question']}
                        label='Question'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter question',
                          },
                        ]}
                      >
                        <Input.TextArea rows={4} />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, 'is_file_upload']}
                        fieldKey={[field.key, 'is_file_upload']}
                        label='Requires File Upload?'
                        valuePropName='checked'
                      >
                        <Switch checkedChildren='Yes' unCheckedChildren='No' />
                      </Form.Item>
                    </Col>

                    <Col xs={4} sm={4} md={4}>
                      <Row justify='center' align='middle'>
                        <Button
                          type='primary'
                          danger
                          icon={<MinusCircleOutlined />}
                          size='large'
                          onClick={async () => {
                            if (onRemove) {
                              await onRemove(field.name);
                            }
                            remove(field.name);
                          }}
                        />
                      </Row>
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button
                    type='dashed'
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{
                      height: 103,
                    }}
                  >
                    Add Question
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>
      </Col>
    </Row>
  </>
);

export default ClubSecurityQuestionsForm;
