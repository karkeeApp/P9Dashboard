import { UploadProps } from 'antd';
import { Moment } from 'moment';

export interface Banner {
  id: number;
  title: string;
  content: string;
  filename: string;
  status: BannerStatus;
  uploaded_by: number;
  created_at: Moment | Date | string | null;
  updated_at: Moment | Date | string | null;
  account_id: number;
  image: string;
}

export enum BannerStatus {
  DELETED = 0,
  ACTIVE = 1,
  INACTIVE = 2,
}

export interface BannerFormData {
  [key: string]: BannerFormData[keyof BannerFormData];
  title: string;
  image: UploadProps['fileList'];
  content: string;
  status: number | boolean;
}
