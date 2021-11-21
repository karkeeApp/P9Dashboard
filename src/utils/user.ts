import { TagProps } from 'antd';

// Types
import { User, UserRole } from '@/types/user';

export function getUserRoleLabel(role: UserRole): string {
  switch (role) {
    case UserRole.USER:
      return 'User';

    case UserRole.SUPER_ADMIN:
      return 'Super Admin';

    case UserRole.MAIN_ADMIN:
      return 'Main Admin';

    case UserRole.MEMBERSHIP_DIRECTOR:
      return 'Membership Director';

    case UserRole.ACCOUNT:
      return 'Account';

    case UserRole.SPONSORSHIP:
      return 'Sponsorship';

    case UserRole.MARKETING:
      return 'Marketing';

    case UserRole.TREASURER:
      return 'Treasurer';

    case UserRole.EVENT_DIRECTOR:
      return 'Event Director';

    case UserRole.VICE_DIRECTOR:
      return 'Vice Director';

    case UserRole.PRESIDENT:
      return 'President';

    case UserRole.SUB_ADMIN:
      return 'Sub Admin';

    default:
      return '';
  }
}

export function getUserStatusTagColor(
  status: User['status'],
): TagProps['color'] {
  switch (status) {
    case 0:
      return 'red';

    case 1:
      return 'blue';

    case 3:
      return 'green';

    case 4:
      return 'purple';

    default:
      return 'yellow';
  }
}
