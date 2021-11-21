import { UploadProps } from 'antd';
import { Moment } from 'moment';

// Types
import { User } from './user';

export interface Club {
  account_id: number;
  company: string;
  status: ClubStatus;
  club_code: number | null;
  confirmed_by: number | null;
  approved_by: number | null;
  approved_at: Moment | Date | string | null;
  is_one_approval: number;
  enable_ads: number;
  skip_approval: number;
  member_expiry: Moment | Date | string | null;
  num_days_expiry: number;
  renewal_alert: number;
  created_at: Moment | Date | string;
  updated_at: Moment | Date | string;
  company_full_name: string;
  address: string | null;
  contact_name: string;
  email: string;
  logo: string | null;
  hash_id: string;
  prefix: string | null;
  user_id: number;
  logo_url: string;
}

export enum ClubStatus {
  PENDING = 1,
  APPROVED = 2,
  DELETED = 3,
  REJECTED = 4,
}

export interface ClubFormData {
  /**
   * General
   */

  // Basic Info
  company: string;
  company_full_name: string;
  address: string;

  // Contact Info
  contact_name?: string;
  email?: string;

  // Logo
  logo: UploadProps['fileList'];

  /**
   * Membership
   */

  // Security Questions
  security_questions: ClubSecurityQuestion[];
}

export interface ClubSettingsFormData {
  club_code: Club['club_code'];
  is_one_approval: boolean;
  enable_ads: boolean;
  skip_approval: boolean;
  num_days_expiry: number;
  renewal_alert: Club['renewal_alert'];
}

export interface ClubSecurityQuestion {
  id: number;
  account_id: number;
  question: string;
  is_file_upload: number;
}

export interface ClubMember {
  id: number;
  account_id: number;
  user_id: number;
  club_code: string;
  filename: string;
  description: string;
  status: ClubMemberStatus;
  confirmed_by: number | null;
  approved_by: number | null;
  approved_at: number | null;
  created_at: Moment | Date | string;
  updated_at: Moment | Date | string;
  account: Club;
  user: User;
}

export enum ClubMemberStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  DELETED = 4,
}
