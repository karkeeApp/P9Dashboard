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

export interface UserGeneralDescriptionProps {
  user: User;
}

const UserGeneralDescription: FC<UserGeneralDescriptionProps> = ({ user }) => {
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
                {user.fullname}
              </Descriptions.Item>
              <Descriptions.Item label='NRIC'>{user.nric}</Descriptions.Item>
              <Descriptions.Item label='Birthday'>
                {user.birthday && moment(user.birthday).isValid()
                  ? moment(user.birthday).format('YYYY-MM-DD')
                  : null}
              </Descriptions.Item>
              <Descriptions.Item label='Gender'>
                {GenderOptions.find((g) => g.value === user.gender)?.label}
              </Descriptions.Item>

              <Descriptions.Item label='Profession'>
                {user.profession}
              </Descriptions.Item>
              <Descriptions.Item label='Company'>
                {user.company}
              </Descriptions.Item>
              <Descriptions.Item label='Annual Salary'>
                {
                  options.salaries.find((s) => s.value === user.annual_salary)
                    ?.label
                }
              </Descriptions.Item>
              <Descriptions.Item label='Member Expire'>
                {user.member_expire_raw}
              </Descriptions.Item>
              <Descriptions.Item label='Status'>
                <Tag color={getUserStatusTagColor(user.status)}>
                  {
                    settings.user_status.find((s) => s.value === user.status)
                      ?.label
                  }
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label='About'>{user.about}</Descriptions.Item>
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
                {user.add_1}
              </Descriptions.Item>
              <Descriptions.Item label='Address 2'>
                {user.add_2}
              </Descriptions.Item>
              <Descriptions.Item label='Unit Number'>
                {user.unit_no}
              </Descriptions.Item>
              <Descriptions.Item label='Postal Code'>
                {user.postal_code}
              </Descriptions.Item>
              <Descriptions.Item label='Country'>
                {CountryOptions.find((c) => c.value === user.country)?.label}
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
              {user.img_profile ? (
                <img
                  className='img-fluid'
                  src={user.img_profile}
                  alt={user.img_profile}
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
              {user.img_nric ? (
                <img
                  className='img-fluid'
                  src={user.img_nric}
                  alt={user.img_nric}
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

export default UserGeneralDescription;
