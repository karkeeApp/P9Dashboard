import { Moment } from 'moment';

// Types
import { User } from './user';

export interface Notification {
  notification_id: number;
  user_id: number;
  is_read: number;
  message: string;
  created_at: Moment | Date | string;
  title: string;
  user: User;
}
