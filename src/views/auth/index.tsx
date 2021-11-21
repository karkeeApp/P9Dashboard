import { FC, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Configs
import { AUTH_PREFIX_PATH } from '@/configs/app';

// Components
import Loading from '@/components/shared/Loading';

const AuthView: FC = () => (
  <Suspense fallback={<Loading cover='page' />}>
    <div className='auth-container'>
      <Switch>
        <Route
          path={`${AUTH_PREFIX_PATH}/login`}
          component={lazy(() => import(`./SignInView`))}
        />
        <Redirect
          from={`${AUTH_PREFIX_PATH}`}
          to={`${AUTH_PREFIX_PATH}/login`}
        />
      </Switch>
    </div>
  </Suspense>
);

export default AuthView;
