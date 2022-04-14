/* eslint-disable */
import { FC, memo, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tooltip, Button, Tabs } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// Types
import { ResponseData } from '@/types/api';
import { Listing } from '@/types/listing';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

// Components
import { PageHeaderAlt } from '@/components/layout';
import { Flex, Loading } from '@/components/shared';
import { ListingGeneralDescription } from '@/components/listing';

const { TabPane } = Tabs;

const ListingDetailsView: FC<RouteComponentProps<{ id: string }>> = ({
  history,
  match,
}) => {
  const { id } = match.params;
  const [loading, setLoading] = useState<boolean>(false);
  const [listing, setListing] = useState<Listing | null>(null);

  const fetchListing = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { data: fetchedListing },
      } = await API.get<ResponseData<Listing>>('/listing/view-by-id', {
        params: {
          listing_id: id,
        },
      });

      setListing(fetchedListing);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      void fetchListing();
      return;
    }

    history.push({
      pathname: `${APP_PREFIX_PATH}/listings`,
    });
  }, [id]);

  return !loading && listing !== null ? (
    <>
      <PageHeaderAlt className='border-bottom' overlap>
        <div className='container'>
          <Flex
            className='py-2'
            mobileFlex={false}
            justifyContent='between'
            alignItems='center'
          >
            <Flex
              className='mb-3'
              justifyContent='between'
              alignItems='baseline'
            >
              <h2 className='mr-2'>{listing.title}</h2>
              <Tooltip title='Edit' placement='bottom'>
                <Button
                  type='text'
                  icon={<EditOutlined />}
                  onClick={() =>
                    history.push({
                      pathname: `${APP_PREFIX_PATH}/listings/edit/${listing.listing_id}`,
                    })
                  }
                />
              </Tooltip>
            </Flex>
          </Flex>
        </div>
      </PageHeaderAlt>

      <div className='container'>
        <Tabs
          defaultActiveKey='general'
          style={{
            marginTop: 30,
          }}
        >
          <TabPane key='general' tab='General'>
            <ListingGeneralDescription listing={listing} />
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <Loading cover='content' />
  );
};

export default memo(ListingDetailsView);
/* eslint-enable */
