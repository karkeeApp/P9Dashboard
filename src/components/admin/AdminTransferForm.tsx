import { FC, useState, useEffect, useCallback } from 'react';
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
import { UploadFile } from 'antd/lib/upload/interface';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Utils
import { normFile, getBase64 } from '@/utils/upload';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface AdminTransferFormProps {
  transferScreenshot: UploadProps['fileList'];
}

const AdminTransferForm: FC<AdminTransferFormProps> = ({
  transferScreenshot,
}) => {
  const [transferScreenshotThumbnail, setTransferScreenshotThumbnail] =
    useState<UploadProps['fileList']>([]);

  const getTransferScreenshotThumbnail = useCallback(async () => {
    if (transferScreenshot && transferScreenshot.length > 0) {
      if (transferScreenshot[0].url) {
        setTransferScreenshotThumbnail(transferScreenshot);
      } else if (transferScreenshot[0].originFileObj) {
        const getTransferScreenshotThumbnailURL = await getBase64(
          transferScreenshot[0].originFileObj,
        );
        setTransferScreenshotThumbnail([
          {
            name: transferScreenshot[0].name,
            url: getTransferScreenshotThumbnailURL as string,
          } as UploadFile,
        ]);
      }
    }
  }, [transferScreenshot]);

  useEffect(() => {
    void getTransferScreenshotThumbnail();
  }, [transferScreenshot]);

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={17}>
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

        <Col xs={24} sm={24} md={7}>
          <Card title='Transfer Screenhot'>
            <Form.Item
              name='transfer_screenshot'
              valuePropName='fileList'
              getValueFromEvent={normFile}
              style={{
                marginBottom: 0,
              }}
            >
              <Dragger
                multiple={false}
                maxCount={1}
                listType='picture-card'
                showUploadList={false}
                beforeUpload={() => false}
                style={{
                  background: 'unset',
                }}
              >
                {transferScreenshotThumbnail &&
                transferScreenshotThumbnail.length > 0 ? (
                  <img
                    className='img-fluid'
                    src={transferScreenshotThumbnail[0].url}
                    alt={transferScreenshotThumbnail[0].name}
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
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminTransferForm;
