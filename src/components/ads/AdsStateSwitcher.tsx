import { FC, useState } from 'react';
import { Switch, notification } from 'antd';

// Types
import { ResponseData } from '@/types/api';
import { Ads, AdsState } from '@/types/ads';

// API
import API from '@/api';

export interface AdsStateSwitcherProps {
  ads: Ads;
  onFinishSwitch?: (ads: Ads) => Promise<void> | void;
}

const AdsStateSwitcher: FC<AdsStateSwitcherProps> = ({
  ads,
  onFinishSwitch,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSwitchState = async () => {
    try {
      setLoading(true);

      const setVisibilityData: FormData = new FormData();
      setVisibilityData.set('ads_id', String(ads.ads_id));
      setVisibilityData.set(
        'enable_ads',
        ads.enable_ads === AdsState.ON
          ? String(AdsState.OFF)
          : String(AdsState.ON),
      );

      await API.post<ResponseData>('/ads/on-off-ads', setVisibilityData);

      ads.enable_ads =
        ads.enable_ads === AdsState.ON ? AdsState.OFF : AdsState.ON;

      notification.success({
        message: (
          <span>
            Switched ads <strong>{ads.title}</strong> state
          </span>
        ),
      });

      setLoading(false);

      if (onFinishSwitch) {
        void onFinishSwitch(ads);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Switch
      loading={loading}
      checked={ads.enable_ads === AdsState.ON ? true : false}
      checkedChildren='On'
      unCheckedChildren='Off'
      onChange={handleSwitchState}
    />
  );
};

export default AdsStateSwitcher;
