import { UploadProps } from 'antd';
import { Moment } from 'moment';

export interface News {
  news_id: number;
  type: 'news';
  title: string;
  created_at: Moment | Date | string;
  summary: string;
  content: string;
  image: string;
  url: string;
  is_news: boolean;
  is_guest: boolean;
  is_trending: boolean;
  is_event: boolean;
  is_happening: boolean;
  is_public: boolean;
  status: NewsStatus;
  view_more_message: null;
  galleries: NewsGallery[];
}

export enum NewsStatus {
  ACTIVE = 1,
  DELETED = 2,
}

export interface NewsGallery {
  id: number;
  url: string;
}

export interface NewsFormData {
  title: string;
  image: UploadProps['fileList'];
  summary: string;
  content: string;
  categories: number[];
  is_public: boolean;
  galleries: UploadProps['fileList'];
}
