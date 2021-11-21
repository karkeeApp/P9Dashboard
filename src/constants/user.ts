// Types
import { Option } from '@/types';
import { UserRole } from '@/types/user';

// Utils
import { getUserRoleLabel } from '@/utils/user';

export const AccountStatusOptions: Option<string>[] = [
  {
    key: 'all',
    label: 'All Status',
    value: 'all',
  },
  {
    key: 'incomplete',
    label: 'Incomplete',
    value: 'incomplete',
  },
  {
    key: 'pending',
    label: 'Pending',
    value: 'pending',
  },
  {
    key: 'approved',
    label: 'Approved',
    value: 'approved',
  },
  {
    key: 'deleted',
    label: 'Deleted',
    value: 'deleted',
  },
];

export const UserRoleOptions: Option<number>[] = Object.values(UserRole)
  .filter((role) => isNaN(Number(role)) === false)
  .map((role) => ({
    key: Number(role),
    value: Number(role),
    label: getUserRoleLabel(role as UserRole),
  }));

export const AdminRoleOptions: Option<number>[] = UserRoleOptions.filter(
  (role) => role.label.includes('Admin'),
);

export const MemberRoleOptions: Option<number>[] = UserRoleOptions.filter(
  (role) => role.label.includes('User'),
);
