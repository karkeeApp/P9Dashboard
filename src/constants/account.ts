// Types
import { Option } from '@/types';

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
