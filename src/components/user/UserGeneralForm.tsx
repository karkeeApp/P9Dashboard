import { FC } from 'react';
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

// Constants
import { GenderOptions, CountryOptions } from '@/constants';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface UserGeneralFormProps {
  edit?: boolean;
  imgProfile?: UploadProps['fileList'];
  imgNRIC?: UploadProps['fileList'];
  onChangeImgProfile?: UploadProps['onChange'];
  onChangeImgNRIC?: UploadProps['onChange'];
}

const UserGeneralForm: FC<UserGeneralFormProps> = ({
  edit = false,
  imgProfile,
  imgNRIC,
  onChangeImgProfile,
  onChangeImgNRIC,
}) => {
  const { options } = useGlobal();

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={edit ? 17 : 24}>
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

        {edit && (
          <Col xs={24} sm={24} md={7}>
            <Card title='Profile Image'>
              <Dragger
                name='img_profile'
                multiple={false}
                maxCount={1}
                listType='picture-card'
                showUploadList={false}
                beforeUpload={() => false}
                onChange={onChangeImgProfile}
                style={{
                  background: 'unset',
                }}
              >
                {imgProfile && imgProfile.length > 0 ? (
                  <img
                    className='img-fluid'
                    src={imgProfile[0].url}
                    alt={imgProfile[0].name}
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

            <Card title='NRIC Image'>
              <Dragger
                name='img_nric'
                multiple={false}
                maxCount={1}
                listType='picture-card'
                showUploadList={false}
                beforeUpload={() => false}
                onChange={onChangeImgNRIC}
                style={{
                  background: 'unset',
                }}
              >
                {imgNRIC && imgNRIC.length > 0 ? (
                  <img
                    className='img-fluid'
                    src={imgNRIC[0].url}
                    alt={imgNRIC[0].name}
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
};

export default UserGeneralForm;
