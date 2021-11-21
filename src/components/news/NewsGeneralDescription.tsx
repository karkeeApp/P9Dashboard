import { FC } from 'react';
import { Row, Col, Card, Descriptions, Space, Tag, Upload } from 'antd';

// Types
import { News } from '@/types/news';

// Constants
import { NewsCategoryKeys } from '@/constants/news';

// Assets
import { ImageSVG } from '@/assets/svg/icon';

// Custom Hooks
import { useGlobal } from '@/hooks';

// Components
import { CustomIcon } from '@/components/util';

const { Dragger } = Upload;

export interface NewsGeneralDescriptionProps {
  news: News;
}

const NewsGeneralDescription: FC<NewsGeneralDescriptionProps> = ({ news }) => {
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
            <Descriptions.Item label='Title'>{news.title}</Descriptions.Item>
            <Descriptions.Item label='Summary'>
              {news.summary}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title='Content'>
          <div
            dangerouslySetInnerHTML={{
              __html: news.content,
            }}
          />
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
            {news.image ? (
              <img className='img-fluid' src={news.image} alt={news.title} />
            ) : (
              <div>
                <div>
                  <CustomIcon className='display-3' svg={ImageSVG} />
                </div>
              </div>
            )}
          </Dragger>
        </Card>

        <Card title='Publication'>
          <Descriptions
            layout='vertical'
            column={1}
            bordered
            colon={false}
            labelStyle={{
              fontWeight: 'bold',
            }}
          >
            <Descriptions.Item label='Categories'>
              <Space size={[4, 8]} wrap>
                {NewsCategoryKeys.map((category) =>
                  news[category] ? (
                    <Tag key={category} color='blue'>
                      {
                        settings.news_categories.find(
                          (c) => c.value === news[category],
                        )?.label
                      }
                    </Tag>
                  ) : null,
                )}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label='Visibility'>
              {news.is_public ? 'Public' : 'Private'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
};

export default NewsGeneralDescription;
