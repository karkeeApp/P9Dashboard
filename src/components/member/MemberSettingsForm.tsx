import { FC, useState } from 'react';
import { Row, Col, Card, Form, Input, Select, Button } from 'antd';

// Types
import { UserRole } from '@/types/user';

// Constants
import { AdminRoleOptions, MemberRoleOptions } from '@/constants/user';

// Custom Hooks
import { useAuth } from '@/hooks';

export interface MemberSettingsFormProps {
  edit?: boolean;
  onCancelChangePassword?: () => Promise<void> | void;
}

const MemberSettingsForm: FC<MemberSettingsFormProps> = ({
  edit = false,
  onCancelChangePassword,
}) => {
  const { currentUser } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  const handleCancelChangePassword = () => {
    setIsChangingPassword(false);

    if (onCancelChangePassword) {
      void onCancelChangePassword();
    }
  };

  const renderRoleSelector = () => {
    switch (currentUser?.role) {
      case UserRole.MAIN_ADMIN:
        return (
          <Form.Item
            name='role'
            initialValue={UserRole.USER}
            label='Role'
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select
              options={[
                ...AdminRoleOptions.filter(
                  (role) =>
                    role.value === UserRole.MAIN_ADMIN ||
                    role.value === UserRole.SUB_ADMIN,
                ),
                ...MemberRoleOptions,
              ]}
            />
          </Form.Item>
        );

      case UserRole.SUB_ADMIN:
        return (
          <Form.Item
            name='role'
            initialValue={UserRole.USER}
            label='Role'
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select
              options={[
                ...AdminRoleOptions.filter(
                  (role) => role.value === UserRole.SUB_ADMIN,
                ),
                ...MemberRoleOptions,
              ]}
            />
          </Form.Item>
        );

      default:
        return (
          <Form.Item
            name='role'
            initialValue={UserRole.USER}
            label='Role'
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select options={[...AdminRoleOptions, ...MemberRoleOptions]} />
          </Form.Item>
        );
    }
  };

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={17}>
          <Card title='Sign In Info'>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  name='email'
                  label='Email'
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              {edit && !isChangingPassword ? (
                <Col xs={24} sm={24} md={24}>
                  <Button
                    type='primary'
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Change Password
                  </Button>
                </Col>
              ) : (
                <>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name='password'
                      label={edit ? 'New Password' : 'Password'}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Please enter password',
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name='password_confirm'
                      label={edit ? 'Confirm New Password' : 'Confirm Password'}
                      hasFeedback
                      dependencies={['password']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter password confirmation',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }

                            return Promise.reject(
                              new Error(
                                'The two passwords that you entered do not match!',
                              ),
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  {edit && isChangingPassword && (
                    <Col xs={24} sm={24} md={24}>
                      <Row justify='end'>
                        <Button
                          type='link'
                          onClick={handleCancelChangePassword}
                        >
                          Cancel
                        </Button>
                      </Row>
                    </Col>
                  )}
                </>
              )}
            </Row>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Card title='Administration'>{renderRoleSelector()}</Card>
        </Col>
      </Row>
    </>
  );
};

export default MemberSettingsForm;
