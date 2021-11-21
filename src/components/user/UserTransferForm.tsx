import { FC } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  DatePicker,
  Upload,
  UploadProps,
} from 'antd';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface UserTransferFormProps {
  edit?: boolean;
  transferScreenshot?: UploadProps['fileList'];
  onChangeTransferScreenshot?: UploadProps['onChange'];
}

const UserTransferForm: FC<UserTransferFormProps> = ({
  edit = false,
  transferScreenshot,
  onChangeTransferScreenshot,
}) => (
  <>
    <Row gutter={16}>
      <Col xs={24} sm={24} md={edit ? 17 : 24}>
        <Card title='Transfer Info'>
          <Form.Item name='transfer_no' label='Transfer Number'>
            <Input />
          </Form.Item>
          <Form.Item name='transfer_banking_nick' label='Bank Nickname'>
            <Input />
          </Form.Item>
          <Form.Item name='transfer_date' label='Transfer Date'>
            <DatePicker className='w-100' format='YYYY-MM-DD' />
          </Form.Item>
          <Form.Item name='transfer_amount' label='Transfer Amount'>
            <Input />
          </Form.Item>
        </Card>
      </Col>

      {edit && (
        <Col xs={24} sm={24} md={7}>
          <Card title='Transfer Screenhot'>
            <Dragger
              name='transfer_screenshot'
              multiple={false}
              maxCount={1}
              listType='picture-card'
              showUploadList={false}
              beforeUpload={() => false}
              onChange={onChangeTransferScreenshot}
              style={{
                background: 'unset',
              }}
            >
              {transferScreenshot && transferScreenshot.length > 0 ? (
                <img
                  className='img-fluid'
                  src={transferScreenshot[0].url}
                  alt={transferScreenshot[0].name}
                />
              ) : (
                <div>
                  <div>
                    <CustomIcon className='display-3' svg={ImageSVG} />
                    <p>Click or drag file to upload</p>
                  </div>
                </div>
              )}
            </Dragger>
          </Card>
        </Col>
      )}
    </Row>
  </>
);

export default UserTransferForm;
