import { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';

// Types
import { NavMenu } from '@/types/nav';

// Configs
import navigationConfig from '@/configs/nav';

// Components
import IntlMessage from '@/components/util/IntlMessage';

const breadcrumbData: Record<string, JSX.Element> = {
  '/': <IntlMessage id='home' />,
};

navigationConfig.forEach((elm) => {
  const assignBreadcrumb = (obj: NavMenu) => {
    breadcrumbData[obj.path] = <IntlMessage id={obj.name} />;
  };
  assignBreadcrumb(elm);
  if (elm.submenu) {
    elm.submenu.forEach((elm) => {
      assignBreadcrumb(elm);
      if (elm.submenu) {
        elm.submenu.forEach((elm) => {
          assignBreadcrumb(elm);
        });
      }
    });
  }
});

const BreadcrumbRoute = withRouter((props) => {
  const { location } = props;
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const buildBreadcrumb = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbData[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  return <Breadcrumb>{buildBreadcrumb}</Breadcrumb>;
});

export class AppBreadcrumb extends PureComponent {
  render(): JSX.Element {
    return <BreadcrumbRoute />;
  }
}

export default AppBreadcrumb;
