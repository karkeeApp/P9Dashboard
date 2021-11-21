import { FC } from 'react';
import { Row, Col, Card, Upload, Descriptions, Tag } from 'antd';
import moment from 'moment';

// Types
import { User } from '@/types/user';

// Constants
import { GenderOptions, CountryOptions } from '@/constants';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Utils
import { getUserStatusTagColor } from '@/utils/user';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface AdminGeneralDescriptionProps {
  admin: User;
}

const AdminGeneralDescription: FC<AdminGeneralDescriptionProps> = ({
  admin,
}) => {
  const { settings, options } = useGlobal();

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={17}>
          <Card title='Personal Info'>
            <Descriptions
              layout='vertical'
              column={1}
              bordered
              colon={false}
              labelStyle={{
                fontWeight: 'bold',
              }}
            >
              <Descriptions.Item label='Full Name'>
                {admin.fullname}
              </Descriptions.Item>
              <Descriptions.Item label='NRIC'>{admin.nric}</Descriptions.Item>
              <Descriptions.Item label='Birthday'>
                {admin.birthday && moment(admin.birthday).isValid()
                  ? moment(admin.birthday).format('YYYY-MM-DD')
                  : null}
              </Descriptions.Item>
              <Descriptions.Item label='Gender'>
                {GenderOptions.find((g) => g.value === admin.gender)?.label}
              </Descriptions.Item>

              <Descriptions.Item label='Profession'>
                {admin.profession}
              </Descriptions.Item>
              <Descriptions.Item label='Company'>
                {admin.company}
              </Descriptions.Item>
              <Descriptions.Item label='Annual Salary'>
                {
                  options.salaries.find((s) => s.value === admin.annual_salary)
                    ?.label
                }
              </Descriptions.Item>
              <Descriptions.Item label='Member Expire'>
                {admin.member_expire_raw}
              </Descriptions.Item>
              <Descriptions.Item label='Status'>
                <Tag color={getUserStatusTagColor(admin.status)}>
                  {
                    settings.user_status.find((s) => s.value === admin.status)
                      ?.label
                  }
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label='About'>{admin.about}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title='Address Info'>
            <Descriptions
              layout='vertical'
              column={1}
              bordered
              colon={false}
              labelStyle={{
                fontWeight: 'bold',
              }}
            >
              <Descriptions.Item label='Address 1'>
                {admin.add_1}
              </Descriptions.Item>
              <Descriptions.Item label='Address 2'>
                {admin.add_2}
              </Descriptions.Item>
              <Descriptions.Item label='Unit Number'>
                {admin.unit_no}
              </Descriptions.Item>
              <Descriptions.Item label='Postal Code'>
                {admin.postal_code}
              </Descriptions.Item>
              <Descriptions.Item label='Country'>
                {CountryOptions.find((c) => c.value === admin.country)?.label}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={7}>
          <Card title='Profile Image'>
            <Dragger
              name='img_profile'
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
              {admin.img_profile ? (
                <img
                  className='img-fluid'
                  src={admin.img_profile}
                  alt={admin.img_profile}
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

          <Card title='NRIC Image'>
            <Dragger
              name='img_nric'
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
              {admin.img_nric ? (
                <img
                  className='img-fluid'
                  src={admin.img_nric}
                  alt={admin.img_nric}
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
};

export default AdminGeneralDescription;
