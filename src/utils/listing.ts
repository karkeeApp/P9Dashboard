import { TagProps } from 'antd';

// Types
import { Listing, ListingStatus } from '@/types/listing';

export function getListingStatusTagColor(
  status: Listing['status'],
): TagProps['color'] {
  switch (status) {
    case ListingStatus.PENDING:
      return 'yellow';

    case ListingStatus.APPROVED:
      return 'green';

    case ListingStatus.REJECTED:
      return 'red';

    case ListingStatus.DELETED:
      return 'magenta';

    default:
      return 'default';
  }
}
