import { TagProps } from 'antd';

// Types
import { Club, ClubMember, ClubMemberStatus } from '@/types/club';

export function getClubStatusTagColor(
  status: Club['status'],
): TagProps['color'] {
  switch (status) {
    case 1:
      return 'blue';

    case 2:
      return 'green';

    case 3:
      return 'red';

    case 4:
      return 'purple';

    default:
      return 'default';
  }
}

export function getClubMemberStatusTagColor(
  status: ClubMember['status'],
): TagProps['color'] {
  switch (status) {
    case ClubMemberStatus.DELETED:
      return 'magenta';

    case ClubMemberStatus.PENDING:
      return 'blue';

    case ClubMemberStatus.APPROVED:
      return 'green';

    case ClubMemberStatus.REJECTED:
      return 'red';

    default:
      return 'default';
  }
}
