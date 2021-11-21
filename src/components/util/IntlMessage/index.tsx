import { FC } from 'react';
import {
  FormattedMessage,
  WrappedComponentProps,
  injectIntl,
} from 'react-intl';
import { Props as FormattedMessageProps } from 'react-intl/src/components/message';

const IntlMessage: FC<WrappedComponentProps & FormattedMessageProps> = (
  props,
) => <FormattedMessage {...props} />;

export default injectIntl(IntlMessage);
