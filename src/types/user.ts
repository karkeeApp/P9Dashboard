import { UploadProps } from 'antd';
import { Moment } from 'moment';

// Types
import { Option } from '.';
import { Club } from './club';
import { SponsorLevel } from './sponsor';

export interface AdminSetting {
  id: number;
  key: AdminSetting['id'];
  name: string;
}

export interface AdminOption {
  id: number | string;
  key: AdminOption['id'];
  value: string;
}

export interface AdminSettingResponseData {
  user_roles: AdminSetting[];
  user_status: AdminSetting[];
  sponsor_levels: AdminSetting[];
  member_types: AdminSetting[];
  club_status: AdminSetting[];
  ads_status: AdminSetting[];
  ads_states: AdminSetting[];
  banner_status: AdminSetting[];
  news_status: AdminSetting[];
  news_categories: AdminSetting[];
  event_status: AdminSetting[];
  attendee_status: AdminSetting[];
  listing_status: AdminSetting[];
  account_membership_status: AdminSetting[];
  payment_for: AdminSetting[];
  payment_status: AdminSetting[];
}

export interface AdminSettingObject {
  [key: string]: AdminSettingObject[keyof AdminSettingObject];
  user_roles: Option<AdminSetting['id']>[];
  user_status: Option<AdminSetting['id']>[];
  sponsor_levels: Option<AdminSetting['id']>[];
  member_types: Option<AdminSetting['id']>[];
  club_status: Option<AdminSetting['id']>[];
  ads_status: Option<AdminSetting['id']>[];
  ads_states: Option<AdminSetting['id']>[];
  banner_status: Option<AdminSetting['id']>[];
  news_status: Option<AdminSetting['id']>[];
  news_categories: Option<AdminSetting['id']>[];
  event_status: Option<AdminSetting['id']>[];
  attendee_status: Option<AdminSetting['id']>[];
  listing_status: Option<AdminSetting['id']>[];
  account_membership_status: Option<AdminSetting['id']>[];
  payment_for: Option<AdminSetting['id']>[];
  payment_status: Option<AdminSetting['id']>[];
}

export interface AdminOptionResponseData {
  owner_options: AdminOption[];
  relationships: AdminOption[];
  salaries: AdminOption[];
}

export interface AdminOptionObject {
  [key: string]: AdminOptionObject[keyof AdminOptionObject];
  owner_options: Option<AdminOption['id']>[];
  relationships: Option<AdminOption['id']>[];
  salaries: Option<AdminOption['id']>[];
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  status: UserStatus;
  premium_status: number;
  is_premium: number;
  created_at: Moment | Date | string;
  updated_at: Moment | Date | string;
  account_id: number;
  mobile: string;
  gender: 'm' | 'f';
  birthday: Moment | Date | string;
  firstname: string;
  lastname: string;
  mobile_code: string;
  country: string;
  postal_code: string;
  unit_no: string;
  add_1: string;
  add_2: string;
  nric: string;
  profession: string;
  company: string;
  annual_salary: string;
  chasis_number: string;
  plate_no: string;
  car_model: string;
  registration_code: string;
  are_you_owner: number;
  contact_person: string;
  emergency_code: string;
  emergency_no: string;
  relationship: number;
  img_profile: string;
  img_nric: string;
  img_insurance: string;
  img_authorization: string;
  img_log_card: string;
  img_log_card_mime_type: string;
  img_vendor: string;
  transfer_no: string;
  transfer_banking_nick: string;
  transfer_date: Moment | Date | string;
  transfer_amount: string;
  transfer_screenshot: string;
  step: number;
  is_vendor: number;
  vendor_name: string;
  vendor_description: string;
  about: string;
  ios_uiid: string;
  android_uiid: string;
  ios_biometric: string;
  android_biometric: string;
  telephone_no: string;
  founded_date: Moment | Date | string;
  member_type: number;
  carkee_member_type: number;
  telephone_code: string;
  fullname: string;
  eun: string;
  number_of_employees: string;
  img_acra: string;
  img_memorandum: string;
  img_car_front: string;
  img_car_back: string;
  img_car_left: string;
  img_car_right: string;
  reset_code: string;
  longitude: string;
  latitude: string;
  member_expire: string;
  member_expire_raw: string;
  approved_by: string;
  confirmed_by: string;
  role: number;
  company_mobile_code: string;
  company_mobile: string;
  company_email: string;
  company_country: string;
  company_postal_code: string;
  company_unit_no: string;
  company_add_1: string;
  company_add_2: string;
  company_logo: string;
  brand_synopsis: string;
  brand_guide: string;
  club: Club | null;
  club_logo: string;
  insurance_date: Moment | Date | string;
  level: string;
  carkee_level: SponsorLevel;
  approved_at: Moment | Date | string;
  near_expiry: boolean;
  renewal_fee: string;
  header_title: string;
  message_body: string;
  social_media: null;
  status_value: string;
  member_since: string;
  membership_status: string;
  is_member: number;
  is_admin: number;
  member_id: number;
  is_membership_expire: boolean;
  dashboard_message: string;
  premium_message: string;
  user_payment: unknown[];
  renewals: unknown[];
}

export interface UserFormData {
  [key: string]: UserFormData[keyof UserFormData];

  /**
   * General
   */

  // Personal
  fullname: string;
  img_profile: UploadProps['fileList'];
  img_nric: UploadProps['fileList'];
  nric: string;
  birthday: Moment | Date | string;
  gender: 'm' | 'f';
  profession: string;
  company: string;
  member_expire: Moment | Date | string;
  member_expire_raw: Moment | Date | string;
  about: string;

  // Address
  add_1: string;
  add_2: string;
  unit_no: string;
  postal_code: string;
  country: string;

  /**
   * Vehicle
   */

  chasis_number: string;
  plate_no: string;
  car_model: string;
  are_you_owner: number;
  registration_code: string;

  /**
   * Emergency
   */

  emergency_no: string;
  contact_person: string;
  mobile_code: string;
  mobile: string;
  relationship: number;

  /**
   * Transfer
   */

  transfer_no: string;
  transfer_screenshot: UploadProps['fileList'];
  transfer_banking_nick: string;
  transfer_date: Moment | Date | string;
  transfer_amount: string;

  /**
   * Settings
   */

  // Sign In
  email: string;
  password: string;
  password_confirm: string;

  // Administration
  role: number;
}

export enum UserImg {
  PROFILE = 'img_profile',
  NRIC = 'img_nric',
  INSURANCE = 'img_insurance',
  LOG_CARD = 'img_log_card',
  AUTHORIZATION = 'img_authorization',
  TRANSFER_SCREENSHOT = 'transfer_screenshot',
}

export interface UserImgFormData {
  user_id: number;
  field: UserImg;
  file: UploadProps['fileList'];
}

export enum UserRole {
  USER = 0,
  SUPER_ADMIN = 1,
  MAIN_ADMIN = 2,
  MEMBERSHIP_DIRECTOR = 3,
  ACCOUNT = 4,
  SPONSORSHIP = 5,
  MARKETING = 6,
  TREASURER = 8,
  EVENT_DIRECTOR = 9,
  VICE_DIRECTOR = 10,
  PRESIDENT = 11,
  SUB_ADMIN = 12,
}

export enum UserStatus {
  DELETED = 0,
  INCOMPLETE = 1,
  PENDING_CONFIRMATION = 2,
  APPROVED = 3,
  REJECTED = 4,
  PENDING_RENEWAL_APPROVAL = 5,
  PENDING_APPROVAL = 6,
}
