import { TagProps } from 'antd';

// Types
import { Payment, PaymentStatus } from '@/types/payment';

export function getPaymentStatusTagColor(
  status: Payment['status'],
): TagProps['color'] {
  switch (status) {
    case PaymentStatus.DELETED:
      return 'magenta';

    case PaymentStatus.PENDING:
      return 'blue';

    case PaymentStatus.APPROVED:
      return 'green';

    case PaymentStatus.REJECTED:
      return 'red';

    case PaymentStatus.CONFIRMED:
      return 'green';

    default:
      return 'default';
  }
}
