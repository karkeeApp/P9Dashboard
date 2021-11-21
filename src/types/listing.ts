import { Moment } from 'moment';
import { UploadProps } from 'antd';

// Types
import { Vendor } from './vendor';

export interface Listing {
  listing_id: number;
  user_id: number;
  title: string;
  content: string;
  image: string;
  status: ListingStatus;
  created_at: Moment | Date | string;
  updated_at: Moment | Date | string;
  approved_by: number;
  confirmed_by: number;
  is_primary: number;
  status_value: string;
  primary_photo: string;
  gallery: ListingGallery[];
  vendor_info: Vendor;
  related: Listing[];
}

export enum ListingStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  DELETED = 4,
}

export interface ListingGallery {
  id: number;
  url: string;
}

export interface ListingFormData {
  title: string;
  content: string;
  image: UploadProps['fileList'];
  gallery: UploadProps['fileList'];
}
