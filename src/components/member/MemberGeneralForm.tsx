import { FC, useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  UploadProps,
} from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

// Constants
import { GenderOptions, CountryOptions } from '@/constants';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { normFile, getBase64 } from '@/utils/upload';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface MemberGeneralFormProps {
  imgProfile: UploadProps['fileList'];
  imgNRIC: UploadProps['fileList'];
}

const MemberGeneralForm: FC<MemberGeneralFormProps> = ({
  imgProfile,
  imgNRIC,
}) => {
  const { options } = useGlobal();
  const [imgProfileThumbnail, setImgProfileThumbnail] =
    useState<UploadProps['fileList']>();
  const [imgNricThumbnail, setImgNricThumbnail] =
    useState<UploadProps['fileList']>();

  const getImgProfileThumbnail = useCallback(async () => {
    if (imgProfile && imgProfile.length > 0) {
      if (imgProfile[0].url) {
        setImgProfileThumbnail(imgProfile);
      } else if (imgProfile[0].originFileObj) {
        const imgProfileThumbnailURL = await getBase64(
          imgProfile[0].originFileObj,
        );
        setImgProfileThumbnail([
          {
            name: imgProfile[0].name,
            url: imgProfileThumbnailURL as string,
          } as UploadFile,
        ]);
      }
    }
  }, [imgProfile]);

  const getImgNricThumbnail = useCallback(async () => {
    if (imgNRIC && imgNRIC.length > 0) {
      if (imgNRIC[0].url) {
        setImgNricThumbnail(imgNRIC);
      } else if (imgNRIC[0].originFileObj) {
        const imgNricThumbnailURL = await getBase64(imgNRIC[0].originFileObj);
        setImgNricThumbnail([
          {
            name: imgNRIC[0].name,
            url: imgNricThumbnailURL as string,
          } as UploadFile,
        ]);
      }
    }
  }, [imgNRIC]);

  useEffect(() => {
    void getImgProfileThumbnail();
  }, [imgProfile]);

  useEffect(() => {
    void getImgNricThumbnail();
  }, [imgNRIC]);

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title='Personal Info'>
          <Form.Item
            name='fullname'
            label='Full Name'
            rules={[
              {
                required: true,
                message: 'Please enter full name',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='nric' label='NRIC'>
            <Input />
          </Form.Item>
          <Form.Item name='birthday' label='Birthday'>
            <DatePicker className='w-100' format='YYYY-MM-DD' />
          </Form.Item>
          <Form.Item name='gender' label='Gender'>
            <Select options={GenderOptions} />
          </Form.Item>
          <Form.Item name='profession' label='Profession'>
            <Input />
          </Form.Item>
          <Form.Item name='company' label='Company'>
            <Input />
          </Form.Item>
          <Form.Item name='annual_salary' label='Annual Salary'>
            <Select options={options.salaries} />
          </Form.Item>
          <Form.Item name='member_expire' label='Member Expire'>
            <DatePicker className='w-100' format='YYYY-MM-DD' />
          </Form.Item>
          <Form.Item name='about' label='About'>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Card>

        <Card title='Address Info'>
          <Form.Item name='add_1' label='Address 1'>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name='add_2' label='Address 2'>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name='unit_no' label='Unit Number'>
            <Input />
          </Form.Item>
          <Form.Item name='postal_code' label='Postal Code'>
            <Input />
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

      <Col xs={24} sm={24} md={7}>
        <Card title='Profile Image'>
          <Form.Item
            name='img_profile'
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
              {imgProfileThumbnail && imgProfileThumbnail.length > 0 ? (
                <img
                  className='img-fluid'
                  src={imgProfileThumbnail[0].url}
                  alt={imgProfileThumbnail[0].name}
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

        <Card title='NRIC Image'>
          <Form.Item
            name='img_nric'
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
              {imgNricThumbnail && imgNricThumbnail.length > 0 ? (
                <img
                  className='img-fluid'
                  src={imgNricThumbnail[0].url}
                  alt={imgNricThumbnail[0].name}
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
  );
};

export default MemberGeneralForm;
