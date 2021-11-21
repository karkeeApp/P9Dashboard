import { UploadProps } from 'antd';
import { Moment } from 'moment';

// Types
import { User } from './user';

export interface Event {
  event_id: number;
  title: string;
  created_at: Moment | Date | string;
  content: string;
  summary: string;
  image: string;
  is_attendee: boolean;
  is_closed: number;
  is_paid: number;
  event_fee: number;
  event_date: Moment | Date | string;
  cut_off_at: Moment | Date | string;
  place: string;
  limit: number;
  status: EventStatus;
  is_public: boolean;
  is_past: boolean;
  btn_book_label: string;
  btn_cancel_label: string;
  galleries: EventGallery[];
}

export enum EventStatus {
  ACTIVE = 1,
  DELETED = 2,
}

export interface EventGallery {
  id: number;
  url: string;
}

export interface EditEventFormData {
  [key: string]: EditEventFormData[keyof EditEventFormData];
  title: string;
  place: string;
  is_public: boolean;
  is_paid: boolean;
  event_fee: number;
  content: string;
  event_time: string | Date | Moment;
  event_end: string | Date | Moment;
  image: UploadProps['fileList'];
}

export interface EventFormData {
  [key: string]: EventFormData[keyof EventFormData];
  title: string;
  image: UploadProps['fileList'];
  summary: string;
  content: string;
  place: string;
  event_date: Moment | Date | string;
  cut_off_at: Moment | Date | string;
  limit: number;
  is_public: number | boolean;
  is_paid: number | boolean;
  event_fee: number;
  galleries: UploadProps['fileList'];
}

export interface EventAttendee {
  id: number;
  event_id: number;
  user_id: number;
  status: EventAttendeeStatus;
  paid: number;
  num_guest_brought: number;
  created_at: Moment | Date | string;
  updated_at: Moment | Date | string;
  event: Event;
  user: User;
}

export enum EventAttendeeStatus {
  PENDING = 1,
  CANCELLED = 2,
  CONFIRMED = 3,
  DELETED = 4,
}
