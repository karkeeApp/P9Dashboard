/* eslint-disable */
import { FC } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';

// Configs
import { AUTH_PREFIX_PATH } from '@/configs/app';

interface RouteInterceptorProps extends RouteProps {
  authenticated: boolean;
}

export const RouteInterceptor: FC<RouteInterceptorProps> = ({
  children,
  authenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={({ location }) =>
      authenticated ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: AUTH_PREFIX_PATH,
            state: { from: location },
          }}
        />
      )
    }
  />
);

export default RouteInterceptor;
/* eslint-enable */
