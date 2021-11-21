import { FC, useState, useEffect, useCallback } from 'react';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { ConfigProvider, Row, Col } from 'antd';
import { DirectionType } from 'antd/lib/config-provider';
import clsx from 'clsx';

// Types
import { ResponseData } from '@/types/api';
import { User } from '@/types/user';

// API
import API from '@/api';

// Configs
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from '@/configs/app';

// Lang
import AppLocale from '@/lang';

// Custom Hooks
import { useQuery, useTheme, useBodyClass, useGlobal, useAuth } from '@/hooks';

// Redux Constants
import { AUTH_TOKEN } from '@/redux/constants/auth';

// Redux Actions
import { setGlobalInternet } from '@/redux/actions/global';
import { setUser } from '@/redux/actions/auth';

// Components
import { NoInternetConnectionCard } from '@/components/shared';
import { RouteInterceptor } from '@/components/util';

// Views
import AppView from '@/views/app';
import AuthView from '@/views/auth';

export const Views: FC<RouteComponentProps> = ({
  location,
  history,
  match,
}) => {
  const query = useQuery();
  const dispatch = useDispatch();
  const { internet } = useGlobal();
  const { currentUser } = useAuth();
  const { locale, direction } = useTheme();
  const currentAppLocale = AppLocale[locale];
  const [loading, setLoading] = useState<boolean>(false);

  useBodyClass(`dir-${direction}`);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await API.get<ResponseData<User>>('/member/info');

      dispatch(setUser(data.data));

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('offline', () => {
      dispatch(
        setGlobalInternet({
          status: 'offline',
        }),
      );
    });
    window.addEventListener('online', () => {
      dispatch(
        setGlobalInternet({
          status: 'online',
        }),
      );
    });

    return () => {
      window.removeEventListener('offline', () => {
        dispatch(
          setGlobalInternet({
            status: 'offline',
          }),
        );
      });
      window.removeEventListener('online', () => {
        dispatch(
          setGlobalInternet({
            status: 'online',
          }),
        );
      });
    };
  }, []);
  useEffect(() => {
    const access_token = query.get('access_token');
    if (access_token) {
      localStorage.setItem(AUTH_TOKEN, access_token);
    }
  }, [query]);
  useEffect(() => {
    if (!currentUser && localStorage.getItem(AUTH_TOKEN)) {
      void fetchUser();
    }
  }, [currentUser]);

  const render = () => {
    if (internet.status === 'online') {
      return loading ? (
        <></>
      ) : (
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <ConfigProvider
            locale={currentAppLocale.antd}
            direction={direction as DirectionType}
          >
            <Switch>
              <Route path={AUTH_PREFIX_PATH} component={AuthView} />

              <RouteInterceptor
                path={APP_PREFIX_PATH}
                authenticated={Boolean(localStorage.getItem(AUTH_TOKEN))}
              >
                <AppView location={location} history={history} match={match} />
              </RouteInterceptor>

              <Route exact path='/'>
                <Redirect to={APP_PREFIX_PATH} />
              </Route>
            </Switch>
          </ConfigProvider>
        </IntlProvider>
      );
    }

    return (
      <div
        className={clsx(
          'container',
          'd-flex',
          'flex-column',
          'justify-content-center',
          'h-100',
        )}
      >
        <Row justify='center'>
          <Col xs={20} sm={20} md={20} lg={12}>
            <NoInternetConnectionCard />
          </Col>
        </Row>
      </div>
    );
  };

  return render();
};

export default Views;
