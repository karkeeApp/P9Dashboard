import { Moment } from 'moment';
import { UploadProps } from 'antd';

// Types
import { User } from './user';

export interface Payment {
  id: number;
  amount: number;
  payment_for: PaymentFor;
  name: string;
  description: string;
  log_card: string | null;
  log_card_mime_type: string | null;
  created_at: Moment | Date | string;
  status: PaymentStatus;
  confirmed_by: number | null;
  confirmed_at: Moment | Date | string | null;
  approved_by: number | null;
  approved_at: Moment | Date | string | null;
  link: string;
  email: string;
  user: User;
}

export enum PaymentFor {
  OTHERS = 0,
  PREMIUM = 1,
  RENEWAL = 2,
  ADS = 3,
}

export enum PaymentStatus {
  DELETED = 0,
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  CONFIRMED = 4,
}

export interface PaymentFormData {
  name: string;
  amount: number;
  image: UploadProps['fileList'];
  payment_for: PaymentFor;
}
