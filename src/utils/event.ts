import { TagProps } from 'antd';

// Types
import {
  Event,
  EventStatus,
  EventAttendee,
  EventAttendeeStatus,
} from '@/types/event';

export function getEventStatusTagColor(
  status: Event['status'],
): TagProps['color'] {
  switch (status) {
    case EventStatus.ACTIVE:
      return 'green';

    case EventStatus.DELETED:
      return 'red';

    default:
      return 'default';
  }
}

export function getEventAttendeeStatusTagColor(
  status: EventAttendee['status'],
): TagProps['color'] {
  switch (status) {
    case EventAttendeeStatus.CANCELLED:
      return 'red';

    case EventAttendeeStatus.CONFIRMED:
      return 'green';

    case EventAttendeeStatus.DELETED:
      return 'magenta';

    default:
      return 'default';
  }
}
