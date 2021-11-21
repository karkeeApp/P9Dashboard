import { FC, Suspense } from 'react';
import {
  Route,
  RouteProps,
  useRouteMatch,
  Switch,
  Redirect,
  RedirectProps,
} from 'react-router-dom';
import { PartialLocation } from 'history';

// Components
import Loading, { LoadingProps } from '@/components/shared/Loading';

interface PageRouterProps {
  routes: RouteProps[];
  from: RedirectProps['from'];
  to: string | PartialLocation;
  align: string;
  cover: LoadingProps['cover'];
}

const PageRouter: FC<PageRouterProps> = ({
  routes,
  from,
  to,
  align,
  cover,
}) => {
  const { url } = useRouteMatch();

  return (
    <Suspense fallback={<Loading align={align} cover={cover} />}>
      <Switch>
        {routes.map((route) => (
          <Route
            key={`route-${route.path as string}`}
            path={`${url}/${route.path as string}`}
            component={route.component}
          />
        ))}
        <Redirect from={from} to={to} />
      </Switch>
    </Suspense>
  );
};

export default PageRouter;
