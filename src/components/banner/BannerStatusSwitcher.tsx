import { FC, useState } from 'react';
import { Switch, notification } from 'antd';

// Types
import { ResponseData } from '@/types/api';
import { Banner, BannerStatus } from '@/types/banner';

// API
import API from '@/api';

export interface BannerStatusSwitcherProps {
  banner: Banner;
  onFinishSwitch?: (banner: Banner) => Promise<void> | void;
}

const BannerStatusSwitcher: FC<BannerStatusSwitcherProps> = ({
  banner,
  onFinishSwitch,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSwitchStatus = async () => {
    try {
      setLoading(true);

      const switchData: FormData = new FormData();
      switchData.set('banner_id', String(banner.id));
      switchData.set(
        'status',
        banner.status === BannerStatus.ACTIVE
          ? String(BannerStatus.INACTIVE)
          : String(BannerStatus.ACTIVE),
      );

      await API.post<ResponseData<Banner>>(
        '/banner/on-off-banners',
        switchData,
      );

      banner.status =
        banner.status === BannerStatus.ACTIVE
          ? BannerStatus.INACTIVE
          : BannerStatus.ACTIVE;

      notification.success({
        message: (
          <span>
            Switched banner <strong>{banner.title}</strong> status
          </span>
        ),
      });

      setLoading(false);

      if (onFinishSwitch) {
        void onFinishSwitch(banner);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Switch
      loading={loading}
      checked={banner.status === BannerStatus.ACTIVE ? true : false}
      checkedChildren='Active'
      unCheckedChildren='Inactive'
      onChange={handleSwitchStatus}
    />
  );
};

export default BannerStatusSwitcher;
