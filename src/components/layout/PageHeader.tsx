import { FC } from 'react';

// Components
import AppBreadcrumb from '@/components/layout/AppBreadcrumb';
import IntlMessage from '@/components/util/IntlMessage';

interface PageHeaderProps {
  title: string;
  display: boolean;
}

const PageHeader: FC<PageHeaderProps> = ({ title, display }) => display ? (
    <div className='app-page-header'>
      <h3 className='mb-0 mr-3 font-weight-semibold'>
        <IntlMessage id={title || 'home'} />
      </h3>
      <AppBreadcrumb />
    </div>
  ) : null;

export default PageHeader;
