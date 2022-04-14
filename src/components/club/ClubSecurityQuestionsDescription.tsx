/* eslint-disable */
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Card, Empty, Typography, Button } from 'antd';

// Types
import { Club, ClubSecurityQuestion } from '@/types/club';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

const { Meta } = Card;
const { Text } = Typography;

export interface ClubSecurityQuestionsDescriptionProps {
  club: Club;
  securityQuestions: ClubSecurityQuestion[];
}

const ClubSecurityQuestionsDescription: FC<
  ClubSecurityQuestionsDescriptionProps
> = ({ club, securityQuestions }) => {
  const history = useHistory();

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24}>
          <Card>
            {securityQuestions.length > 0 ? (
              <Row gutter={16}>
                {securityQuestions.map((securityQuestion, idx) => (
                  <Col key={securityQuestion.id} xs={24} sm={24} md={12}>
                    <Card type='inner' title={`Question ${idx + 1}`}>
                      <Meta
                        title={securityQuestion.question}
                        description={
                          securityQuestion.is_file_upload
                            ? 'Requires File Upload'
                            : undefined
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                description={
                  <Text type='secondary'>No Security Questions</Text>
                }
              >
                <Button
                  type='primary'
                  onClick={() =>
                    history.push({
                      pathname: `${APP_PREFIX_PATH}/clubs/edit/${club.account_id}`,
                      search: '?tab=membership',
                    })
                  }
                >
                  Add Now
                </Button>
              </Empty>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ClubSecurityQuestionsDescription;
/* eslint-enable */
