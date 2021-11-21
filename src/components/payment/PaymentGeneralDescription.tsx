import { FC } from 'react';
import { Row, Col, Card, Descriptions, Typography, Tag, Upload } from 'antd';

// Types
import { Payment } from '@/types/payment';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getPaymentStatusTagColor } from '@/utils/payment';

// Components
import { CustomIcon } from '@/components/util';

const { Link } = Typography;
const { Dragger } = Upload;

export interface PaymentGeneralDescriptionProps {
  payment: Payment;
}

const PaymentGeneralDescription: FC<PaymentGeneralDescriptionProps> = ({
  payment,
}) => {
  const { settings } = useGlobal();

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title='Basic Info'>
          <Descriptions
            layout='vertical'
            column={1}
            bordered
            colon={false}
            labelStyle={{
              fontWeight: 'bold',
            }}
          >
            <Descriptions.Item label='Amount'>
              {`S$${payment.amount}`}
            </Descriptions.Item>
            <Descriptions.Item label='Payment For'>
              {
                settings.payment_for.find(
                  (s) => s.value === payment.payment_for,
                )?.label
              }
            </Descriptions.Item>
            <Descriptions.Item label='Name'>{payment.name}</Descriptions.Item>
            <Descriptions.Item label='Description'>
              {payment.description}
            </Descriptions.Item>
            <Descriptions.Item label='Status'>
              <Tag color={getPaymentStatusTagColor(payment.status)}>
                {
                  settings.payment_status.find(
                    (s) => s.value === payment.status,
                  )?.label
                }
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Email'>{payment.email}</Descriptions.Item>
            <Descriptions.Item label='User'>
              <Link href={`${APP_PREFIX_PATH}/members/${payment.user.user_id}`}>
                {payment.user.fullname}
              </Link>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>

      <Col xs={24} sm={24} md={7}>
        <Card title='Image'>
          <Dragger
            name='image'
            disabled
            multiple={false}
            maxCount={1}
            listType='picture-card'
            showUploadList={false}
            beforeUpload={() => false}
            style={{
              background: 'unset',
            }}
          >
            {payment.link ? (
              <img
                className='img-fluid'
                src={payment.link}
                alt={payment.description}
              />
            ) : (
              <div>
                <div>
                  <CustomIcon className='display-3' svg={ImageSVG} />
                </div>
              </div>
            )}
          </Dragger>
        </Card>
      </Col>
    </Row>
  );
};

export default PaymentGeneralDescription;
