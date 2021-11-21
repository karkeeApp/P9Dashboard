import { FC, useState } from 'react';
import { Button, notification } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

// Types
import { ResponseData } from '@/types/api';
import { Ads } from '@/types/ads';

// API
import API from '@/api';

export interface AddIsBottomSetterProps {
  ads: Ads;
  onFinishSetIsBottom?: (ads: Ads) => Promise<void> | void;
}

const AdsIsBottomSetter: FC<AddIsBottomSetterProps> = ({
  ads,
  onFinishSetIsBottom,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSetIsBottom = async () => {
    try {
      setLoading(true);

      const setIsBottomData: FormData = new FormData();
      setIsBottomData.set('id', String(ads.ads_id));

      await API.post<ResponseData>('/ads/is-bottom', setIsBottomData);

      ads.is_bottom = !ads.is_bottom;

      notification.success({
        message: (
          <span>
            Set ads <strong>{ads.title}</strong> is bottom property
          </span>
        ),
      });

      setLoading(false);

      if (onFinishSetIsBottom) {
        void onFinishSetIsBottom(ads);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Button
      type='primary'
      loading={loading}
      danger={ads.is_bottom ? true : undefined}
      icon={ads.is_bottom ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
      onClick={handleSetIsBottom}
    />
  );
};

export default AdsIsBottomSetter;
