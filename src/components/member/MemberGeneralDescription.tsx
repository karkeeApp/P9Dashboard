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

export interface MemberGeneralDescriptionProps {
  member: User;
}

const MemberGeneralDescription: FC<MemberGeneralDescriptionProps> = ({
  member,
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
                {member.fullname}
              </Descriptions.Item>
              <Descriptions.Item label='NRIC'>{member.nric}</Descriptions.Item>
              <Descriptions.Item label='Birthday'>
                {member.birthday && moment(member.birthday).isValid()
                  ? moment(member.birthday).format('YYYY-MM-DD')
                  : null}
              </Descriptions.Item>
              <Descriptions.Item label='Gender'>
                {GenderOptions.find((g) => g.value === member.gender)?.label}
              </Descriptions.Item>

              <Descriptions.Item label='Profession'>
                {member.profession}
              </Descriptions.Item>
              <Descriptions.Item label='Company'>
                {member.company}
              </Descriptions.Item>
              <Descriptions.Item label='Annual Salary'>
                {
                  options.salaries.find((s) => s.value === member.annual_salary)
                    ?.label
                }
              </Descriptions.Item>
              <Descriptions.Item label='Member Expire'>
                {member.member_expire_raw}
              </Descriptions.Item>
              <Descriptions.Item label='Status'>
                <Tag color={getUserStatusTagColor(member.status)}>
                  {
                    settings.user_status.find((s) => s.value === member.status)
                      ?.label
                  }
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label='About'>
                {member.about}
              </Descriptions.Item>
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
                {member.add_1}
              </Descriptions.Item>
              <Descriptions.Item label='Address 2'>
                {member.add_2}
              </Descriptions.Item>
              <Descriptions.Item label='Unit Number'>
                {member.unit_no}
              </Descriptions.Item>
              <Descriptions.Item label='Postal Code'>
                {member.postal_code}
              </Descriptions.Item>
              <Descriptions.Item label='Country'>
                {CountryOptions.find((c) => c.value === member.country)?.label}
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
              {member.img_profile ? (
                <img
                  className='img-fluid'
                  src={member.img_profile}
                  alt={member.img_profile}
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
              {member.img_nric ? (
                <img
                  className='img-fluid'
                  src={member.img_nric}
                  alt={member.img_nric}
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

export default MemberGeneralDescription;
