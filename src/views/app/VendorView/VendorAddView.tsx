import { FC, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Steps,
  Result,
  Button,
  Form,
  FormProps,
  notification,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import update from 'immutability-helper';
import moment from 'moment';

// Types
import { ResponseData } from '@/types/api';
import { Vendor, VendorFormData } from '@/types/vendor';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Custom Hooks
import { useExitPrompt } from '@/hooks';

// Components
import { PageHeaderAlt } from '@/components/layout';
import { Flex } from '@/components/shared';
import { LeavePrompt } from '@/components/util';
import {
  VendorEmailCheckingForm,
  VendorMemberDetailsForm,
  VendorDetailsFrom,
  VendorCompanyDetailsForm,
} from '@/components/vendor';

const { Step } = Steps;

interface EmailChecking {
  loading: boolean;
  errorMessage?: string;
}

const VendorAddView: FC<RouteComponentProps> = ({ history }) => {
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailChecking, setEmailChecking] = useState<EmailChecking>({
    loading: false,
    errorMessage: undefined,
  });
  const [step, setStep] = useState<number>(0);
  const [form] = Form.useForm<VendorFormData>();
  const [vendor, setVendor] = useState<VendorFormData>({} as VendorFormData);
  const [showConversion, setShowConversion] = useState<boolean>(false);
  const [showRegister, setShowRegister] = useState<boolean>(false);

  const handleNextStep = async () => {
    setVendor({
      ...vendor,
      ...(await form.validateFields()),
    });
    setStep(step + 1);
  };
  const handlePrevStep = async () => {
    setVendor({
      ...vendor,
      ...(await form.validateFields()),
    });
    setStep(step - 1);
  };

  const handleConvert = () => {
    setShowConversion(false);
    void handleNextStep();
  };
  const handleCancelConvert = () => {
    setShowConversion(false);
  };

  const handleCheckEmail = async () => {
    try {
      const { email } = form.getFieldsValue();

      setVendor({
        ...vendor,
        email,
      });

      setEmailChecking(
        update(emailChecking, {
          loading: {
            $set: true,
          },
        }),
      );

      const {
        data: { data: checkedVendor },
      } = await API.get<ResponseData<Vendor | null>>(
        '/vendor/search-by-email',
        {
          params: {
            email,
          },
        },
      );

      setEmailChecking(
        update(emailChecking, {
          loading: {
            $set: false,
          },
        }),
      );

      if (checkedVendor) {
        if (checkedVendor.is_vendor) {
          setShowConversion(false);
          setShowRegister(false);
          setEmailChecking(
            update(emailChecking, {
              errorMessage: {
                $set: 'This member is already a vendor. Please try again with different email address!',
              },
            }),
          );
          return;
        }

        if (!checkedVendor.is_vendor) {
          setShowConversion(true);
          setShowRegister(false);
        }
      } else {
        setShowConversion(false);
        setShowRegister(true);
        void handleNextStep();
      }
    } catch (err) {
      setEmailChecking(
        update(emailChecking, {
          loading: {
            $set: false,
          },
        }),
      );
    }
  };
  // const handleCheckName = async (name: string): Promise<boolean> => {
  //   try {
  //     const { data } = await API.get<ResponseData<Vendor>>(
  //       '/vendor/vendor-checker',
  //       {
  //         params: {
  //           vendor_name: name,
  //         },
  //       },
  //     );

  //     if (data.data !== null) {
  //       return Promise.resolve(false);
  //     }

  //     return Promise.resolve(true);
  //   } catch (err) {
  //     return Promise.resolve(false);
  //   }
  // };
  const handleAdd: FormProps<VendorFormData>['onFinish'] = async () => {
    try {
      if (showRegister) {
        if (step === 0) {
          await handleCheckEmail();
          return;
        }

        if (step < 3) {
          void handleNextStep();
          return;
        }
      } else if (step < 2) {
        if (step === 0) {
          await handleCheckEmail();
          return;
        }

        void handleNextStep();
        return;
      }

      setLoading(true);
      const formData = {
        ...vendor,
        ...(await form.validateFields()),
      };

      const addData: FormData = new FormData();

      (Object.keys(formData) as Array<keyof VendorFormData>).forEach((key) => {
        if (formData[key]) {
          switch (key) {
            case 'founded_date':
              addData.set(key, moment(formData[key]).format('YYYY-MM-DD'));
              break;

            default:
              addData.set(key, formData[key] as string);
              break;
          }
        }
      });

      const { data } = await API.post<ResponseData<Vendor>>(
        showConversion ? '/vendor/convert-to-vendor' : '/vendor/create-vendor',
        addData,
        {
          params: {
            email: showConversion ? formData.email : undefined,
          },
        },
      );

      notification.success({
        message: (
          <span>
            Added vendor <strong>{data.data.vendor_name}</strong>
          </span>
        ),
      });

      setLoading(false);
      setShowExitPrompt(false);

      history.push({
        pathname: `${APP_PREFIX_PATH}/vendors`,
      });
    } catch (err) {
      setLoading(false);
    }
  };

  const conversionPrompt = (
    <Row justify='center'>
      <Col xs={24} sm={24} md={12}>
        <Card>
          <Result
            title='Do you want to convert this member to Vendor?'
            subTitle={form.getFieldsValue().email}
            extra={[
              <Button
                key='cancel-convert-button'
                type='text'
                onClick={handleCancelConvert}
              >
                No
              </Button>,
              <Button
                key='convert-button'
                type='primary'
                onClick={handleConvert}
              >
                Yes
              </Button>,
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
  const emailCheckingForm = (
    <VendorEmailCheckingForm
      errorMessage={emailChecking.errorMessage}
      action={
        <Button
          type='primary'
          block
          loading={emailChecking.loading}
          onClick={handleCheckEmail}
        >
          Check Email
        </Button>
      }
    />
  );
  const memberDetailsForm = (
    <VendorMemberDetailsForm
      action={
        <Row gutter={8} justify='end'>
          <Col>
            <Button type='text' onClick={handlePrevStep}>
              Back
            </Button>
          </Col>

          <Col>
            <Button type='primary' onClick={handleNextStep}>
              Next
            </Button>
          </Col>
        </Row>
      }
    />
  );
  const detailsForm = (
    <VendorDetailsFrom
      action={
        <Row gutter={8} justify='end'>
          <Col>
            <Button type='text' onClick={handlePrevStep}>
              Back
            </Button>
          </Col>

          <Col>
            <Button type='primary' onClick={handleNextStep}>
              Next
            </Button>
          </Col>
        </Row>
      }
    />
  );
  const companyDetailsForm = (
    <VendorCompanyDetailsForm
      action={
        <Row gutter={8} justify='end'>
          <Col>
            <Button type='text' disabled={loading} onClick={handlePrevStep}>
              Back
            </Button>
          </Col>

          <Col>
            <Button type='primary' htmlType='submit' loading={loading}>
              Save
            </Button>
          </Col>
        </Row>
      }
    />
  );

  const renderStepContent = () => {
    if (showRegister) {
      switch (step) {
        case 0:
          if (showConversion) {
            return conversionPrompt;
          }

          return emailCheckingForm;

        case 1:
          return memberDetailsForm;

        case 2:
          return detailsForm;

        case 3:
          return companyDetailsForm;

        default:
          return null;
      }
    }

    switch (step) {
      case 0:
        if (showConversion) {
          return conversionPrompt;
        }

        return emailCheckingForm;

      case 1:
        return detailsForm;

      case 2:
        return companyDetailsForm;

      default:
        return null;
    }
  };

  return (
    <>
      <LeavePrompt when={showExitPrompt} />

      <Form
        layout='vertical'
        form={form}
        name='vendor-add-form'
        className='ant-advanced-search-form'
        onFinish={handleAdd}
        onValuesChange={() => setShowExitPrompt(true)}
      >
        {() => (
          <>
            <PageHeaderAlt className='border-bottom' overlap>
              <div className='container'>
                <Flex
                  className='py-2'
                  mobileFlex={false}
                  justifyContent='between'
                  alignItems='center'
                >
                  <h2 className='mb-5'>Add Vendor</h2>
                </Flex>
              </div>
            </PageHeaderAlt>

            <div className='container'>
              <Steps
                current={step}
                style={{
                  marginTop: 15,
                }}
              >
                <Step
                  title='Member Checking'
                  status={emailChecking.loading ? 'process' : undefined}
                  icon={emailChecking.loading ? <LoadingOutlined /> : undefined}
                />
                {showRegister && <Step title='Member Details' />}
                <Step title='Vendor Details' />
                <Step
                  title='Company Details'
                  status={loading ? 'process' : undefined}
                  icon={loading ? <LoadingOutlined /> : undefined}
                />
              </Steps>
            </div>

            <div className={clsx('container', 'mt-5')}>
              {renderStepContent()}
            </div>
          </>
        )}
      </Form>
    </>
  );
};

export default VendorAddView;
