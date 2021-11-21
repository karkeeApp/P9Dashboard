import { FC } from 'react';
import { Row, Col, Card, Descriptions, Upload } from 'antd';
import moment from 'moment';

// Types
import { User } from '@/types/user';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface UserTransferDescriptionProps {
  user: User;
}

const UserTransferDescription: FC<UserTransferDescriptionProps> = ({
  user,
}) => (
  <>
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title='Transfer Info'>
          <Descriptions
            layout='vertical'
            column={1}
            bordered
            colon={false}
            labelStyle={{
              fontWeight: 'bold',
            }}
          >
            <Descriptions.Item label='Transfer Number'>
              {user.transfer_no}
            </Descriptions.Item>
            <Descriptions.Item label='Bank Nickname'>
              {user.transfer_banking_nick}
            </Descriptions.Item>
            <Descriptions.Item label='Transfer Date'>
              {user.transfer_date && moment(user.transfer_date).isValid()
                ? moment(user.transfer_date).format('YYYY-MM-DD')
                : null}
            </Descriptions.Item>
            <Descriptions.Item label='Transfer Amount'>
              {user.transfer_amount}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>

      <Col xs={24} sm={24} md={7}>
        <Card title='Transfer Screenhot'>
          <Dragger
            name='transfer_screenshot'
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
            {user.transfer_screenshot ? (
              <img
                className='img-fluid'
                src={user.transfer_screenshot}
                alt={user.transfer_screenshot}
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
  </>
);

export default UserTransferDescription;
