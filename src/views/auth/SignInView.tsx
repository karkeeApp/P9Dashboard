import { FC, useState, useEffect, CSSProperties } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, Row, Col, Button, Form, FormProps, Input } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
// import { motion } from 'framer-motion';

// Types
import { ResponseData } from '@/types/api';
import { SignInData, SignInResponseData } from '@/types/auth';
import { User } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_NAME, APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useAuth } from '@/hooks';

// Redux Constants
import { AUTH_TOKEN } from '@/redux/constants/auth';

// Redux Actions
import { setUser } from '@/redux/actions/auth';

const backgroundStyle: CSSProperties = {
  backgroundImage: 'url(/img/others/img-17.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

const SignInView: FC<RouteComponentProps> = ({ history }) => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<SignInData>();

  const handleSignIn: FormProps<SignInData>['onFinish'] = async (formData) => {
    try {
      setLoading(true);

      const { data: signInResponseData } = await API.post<SignInResponseData>(
        '/member/login',
        formData,
      );

      localStorage.setItem(AUTH_TOKEN, signInResponseData.token);

      const { data: adminInfoResponseData } = await API.get<ResponseData<User>>(
        '/member/info',
      );

      dispatch(setUser(adminInfoResponseData.data));

      setLoading(false);

      history.push({
        pathname: APP_PREFIX_PATH,
      });
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      history.push({
        pathname: APP_PREFIX_PATH,
      });
    }
  }, [auth.currentUser]);

  return (
    <div className='h-100' style={backgroundStyle}>
      <div className='container d-flex flex-column justify-content-center h-100'>
        <Row justify='center'>
          <Col xs={20} sm={20} md={20} lg={7}>
            <Card>
              <div className='my-4'>
                <div className='text-center'>
                  <img
                    className='img-fluid'
                    width={200}
                    height={140}
                    // src={`/img/${
                    //   theme.currentTheme === 'light'
                    //     ? 'logo.png'
                    //     : 'logo-white.png'
                    // }`}
                    src='/img/p9-logo.png'
                    alt={`${APP_NAME} logo`}
                  />
                  {/* <p>
                    Don't have an account yet?{' '}
                    <a href='/auth/register-1'>Sign Up</a>
                  </p> */}
                </div>
                <Row justify='center'>
                  <Col xs={24} sm={24} md={20} lg={20}>
                    {/* <motion.div
                      initial={{ opacity: 0, marginBottom: 0 }}
                      animate={{
                        opacity: auth.showMessage ? 1 : 0,
                        marginBottom: auth.showMessage ? 20 : 0,
                      }}
                    >
                      <Alert type='error' showIcon message={auth.message} />
                    </motion.div> */}
                    <Form
                      name='signin-form'
                      form={form}
                      layout='vertical'
                      onFinish={handleSignIn}
                    >
                      <Form.Item
                        name='email'
                        label='Email'
                        rules={[
                          {
                            required: true,
                            message: 'Please input your email.',
                          },
                          {
                            type: 'email',
                            message: 'Invalid email address!',
                          },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined className='text-primary' />}
                        />
                      </Form.Item>
                      <Form.Item
                        name='password'
                        label={
                          <div className='d-flex justify-content-between w-100 align-items-center'>
                            <span>Password</span>
                            {/* <span className='cursor-pointer font-size-sm font-weight-normal text-muted'>
                              Forget Password?
                            </span> */}
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            message: 'Please input your password.',
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined className='text-primary' />}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type='primary'
                          htmlType='submit'
                          block
                          loading={loading}
                        >
                          Sign In
                        </Button>
                      </Form.Item>

                      {/* <div>
                        <Divider>
                          <span className='text-muted font-size-base font-weight-normal'>
                            or connect with
                          </span>
                        </Divider>
                        <div className='d-flex justify-content-center'>
                          <Button
                            onClick={() => onGoogleLogin()}
                            className='mr-2'
                            disabled={auth.loading}
                            icon={<CustomIcon svg={GoogleSVG} />}
                          >
                            Google
                          </Button>
                          <Button
                            onClick={() => onFacebookLogin()}
                            icon={<CustomIcon svg={FacebookSVG} />}
                            disabled={auth.loading}
                          >
                            Facebook
                          </Button>
                        </div>
                      </div> */}
                    </Form>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SignInView;
