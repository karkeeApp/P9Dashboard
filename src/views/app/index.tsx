import { FC, lazy, Suspense, memo, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { Layout, Grid } from 'antd';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import update from 'immutability-helper';

// Types
import { ResponseData } from '@/types/api';
import {
  AdminSettingObject,
  AdminSettingResponseData,
  AdminOptionObject,
  AdminOptionResponseData,
} from '@/types/user';
import { Notification } from '@/types/notification';

// API
import API from '@/api';

// Constants
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_TYPE_SIDE,
  NAV_TYPE_TOP,
  DIR_RTL,
  DIR_LTR,
} from '@/constants/theme';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';
import navigationConfig from '@/configs/nav';

// Utils
import utils from '@/utils';

// Custom Hooks
import { useTheme, useGlobal } from '@/hooks';

// Redux Actions
import { setGlobal } from '@/redux/actions/global';

// Components
import Loading from '@/components/shared/Loading';
import {
  SideNav,
  TopNav,
  MobileNav,
  HeaderNav,
  PageHeader,
  Footer,
} from '@/components/layout';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const AppView: FC<RouteComponentProps> = ({ location }) => {
  const dispatch = useDispatch();
  const { navCollapsed, navType, direction } = useTheme();
  const currentRouteInfo = utils.getRouteInfo(
    navigationConfig,
    location.pathname,
  );
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isNavSide = navType === NAV_TYPE_SIDE;
  const isNavTop = navType === NAV_TYPE_TOP;
  const getLayoutGutter = () => {
    if (isNavTop || isMobile) {
      return 0;
    }
    return navCollapsed ? SIDE_NAV_COLLAPSED_WIDTH : SIDE_NAV_WIDTH;
  };

  const { status } = useThemeSwitcher();

  const getLayoutDirectionGutter = () => {
    if (direction === DIR_LTR) {
      return { paddingLeft: getLayoutGutter() };
    }
    if (direction === DIR_RTL) {
      return { paddingRight: getLayoutGutter() };
    }
    return { paddingLeft: getLayoutGutter() };
  };

  const global = useGlobal();

  const fetchGlobal = useCallback(async () => {
    const [
      { data: settings },
      { data: options },
      {
        data: { data: notifications },
      },
    ] = await Promise.all([
      API.get<AdminSettingResponseData>('/site/settings', {
        params: {
          all_roles: 1,
        },
      }),
      API.get<AdminOptionResponseData>('/member/options'),
      API.get<ResponseData<Notification[]>>('/user-notification/list'),
    ]);

    dispatch(
      setGlobal(
        update(global, {
          settings: {
            $set: {
              user_roles: settings.user_roles.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })) as AdminSettingObject['user_roles'],
              user_status: settings.user_status.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })) as AdminSettingObject['user_status'],
              sponsor_levels: settings.sponsor_levels.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })) as AdminSettingObject['sponsor_levels'],
              member_types: settings.member_types.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })) as AdminSettingObject['member_types'],
              club_status: settings.club_status.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })) as AdminSettingObject['club_status'],
              ads_status: settings.ads_status.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })),
              ads_states: settings.ads_states.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })),
              banner_status: settings.banner_status.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })),
              news_status: settings.news_status.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })),
              news_categories: settings.news_categories.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })),
              event_status: settings.event_status.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })),
              attendee_status: settings.attendee_status.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })),
              listing_status: settings.listing_status.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })),
              account_membership_status: settings.listing_status.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })),
              payment_for: settings.payment_for.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })),
              payment_status: settings.payment_status.map((s) => ({
                key: s.id,
                value: s.id,
                label: s.name,
              })),
            },
          },
          options: {
            $set: {
              owner_options: options.owner_options.map((o) => ({
                key: o.id,
                value: o.id,
                label: o.value,
              })) as AdminOptionObject['owner_options'],
              relationships: options.relationships.map((o) => ({
                key: o.id,
                value: o.id,
                label: o.value,
              })) as AdminOptionObject['relationships'],
              salaries: options.salaries.map((o) => ({
                key: o.id,
                value: o.id,
                label: o.value,
              })) as AdminOptionObject['salaries'],
            },
          },
          notifications: {
            $set: notifications,
          },
        }),
      ),
    );
  }, []);

  useEffect(() => {
    if (
      Object.keys(global.settings)
        .map((key) => global.settings[key])
        .every((s) => s.length === 0) &&
      Object.keys(global.options)
        .map((key) => global.options[key])
        .every((o) => o.length === 0)
    ) {
      void fetchGlobal();
    }
  }, [global]);

  return status === 'loading' ? (
    <Loading cover='page' />
  ) : (
    <Layout>
      <HeaderNav isMobile={isMobile} />
      {isNavTop && !isMobile ? <TopNav routeInfo={currentRouteInfo} /> : null}
      <Layout className='app-container'>
        {isNavSide && !isMobile ? (
          <SideNav routeInfo={currentRouteInfo} />
        ) : null}
        <Layout className='app-layout' style={getLayoutDirectionGutter()}>
          <div className={`app-content ${isNavTop ? 'layout-top-nav' : ''}`}>
            {currentRouteInfo && (
              <PageHeader
                display={currentRouteInfo.breadcrumb}
                title={currentRouteInfo.title}
              />
            )}
            <Content>
              <Suspense fallback={<Loading cover='content' />}>
                <Switch>
                  <Route
                    path={APP_PREFIX_PATH}
                    exact
                    component={lazy(() => import('./HomeView'))}
                  />
                  <Route
                    path={`${APP_PREFIX_PATH}/ads`}
                    component={lazy(() => import('./AdsView'))}
                  />
                  <Route
                    path={`${APP_PREFIX_PATH}/payments`}
                    component={lazy(() => import('./PaymentView'))}
                  />
                  <Route
                    path={`${APP_PREFIX_PATH}/clubs`}
                    component={lazy(() => import('./ClubView'))}
                  />
                  <Route
                    path={`${APP_PREFIX_PATH}/admins`}
                    component={lazy(() => import('./AdminView'))}
                  />
                  <Route
                    path={`${APP_PREFIX_PATH}/members`}
                    component={lazy(() => import('./MemberView'))}
                  />
                  <Route
                    path={`${APP_PREFIX_PATH}/vendors`}
                    component={lazy(() => import('./VendorView'))}
                  />
                  <Route
                    path={`${APP_PREFIX_PATH}/sponsors`}
                    component={lazy(() => import('./SponsorView'))}
                  />
                  <Route
                    path={`${APP_PREFIX_PATH}/listings`}
                    component={lazy(() => import('./ListingView'))}
                  />
                  <Route
                    path={`${APP_PREFIX_PATH}/news`}
                    component={lazy(() => import('./NewsView'))}
                  />
                  <Route
                    path={`${APP_PREFIX_PATH}/events`}
                    component={lazy(() => import('./EventView'))}
                  />
                  <Route
                    path={`${APP_PREFIX_PATH}/banners`}
                    component={lazy(() => import('./BannerView'))}
                  />
                </Switch>
              </Suspense>
            </Content>
          </div>
          <Footer />
        </Layout>
      </Layout>
      {isMobile && <MobileNav routeInfo={currentRouteInfo} />}
    </Layout>
  );
};

export default memo(AppView);
