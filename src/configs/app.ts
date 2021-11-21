// Constants
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE, DIR_LTR } from '@/constants/theme';

const { REACT_APP_API_BASE_URL } = process.env;

export const APP_NAME = 'Karkee';
export const API_BASE_URL = REACT_APP_API_BASE_URL;
export const APP_PREFIX_PATH = '/dashboard';
export const AUTH_PREFIX_PATH = '/auth';

export const THEME_CONFIG = {
  navCollapsed: false,
  sideNavTheme: SIDE_NAV_LIGHT,
  locale: 'en',
  navType: NAV_TYPE_SIDE,
  topNavColor: '#3e82f7',
  headerNavColor: '',
  mobileNav: false,
  currentTheme: 'light',
  direction: DIR_LTR,
};
