import { UploadProps } from 'antd';
import { Moment } from 'moment';

export interface Ads {
  ads_id: number;
  title: string;
  created_at: Moment | Date | string;
  summary: string;
  file: string;
  link: string;
  // is_public: boolean;
  is_bottom: boolean;
  status: AdsStatus;
  enable_ads: AdsState;
  galleries: Ads[];
}

export enum AdsState {
  OFF = 0,
  ON = 1,
}

export enum AdsStatus {
  DELETED = 0,
  ACTIVE = 1,
}

export interface AdsFormData {
  [key: string]: AdsFormData[keyof AdsFormData];
  title: string;
  summary: string;
  file: UploadProps['fileList'];
  link: string;
  // is_public: boolean;
  is_bottom: boolean;
}
