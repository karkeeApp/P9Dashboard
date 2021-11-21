// Types
import { User, AdminSettingObject, AdminOptionObject } from '@/types/user';
import { Notification } from '@/types/notification';

export interface Action<T = unknown> {
  type: string;
  payload: T;
}

export interface RootState {
  theme: ThemeReducer;
  auth: AuthReducer;
  global: GlobalReducer;
}

export interface ThemeReducer {
  navCollapsed: boolean;
  sideNavTheme: 'SIDE_NAV_LIGHT' | 'SIDE_NAV_DARK';
  locale: string;
  navType: 'SIDE' | 'TOP';
  topNavColor: string;
  headerNavColor: string;
  mobileNav: boolean;
  currentTheme: 'light' | 'dark';
  direction: 'ltr' | 'rtl';
}

export interface AuthReducer {
  currentUser: User | null;
}

export interface GlobalReducer {
  internet: {
    status: 'online' | 'offline';
  };
  settings: AdminSettingObject;
  options: AdminOptionObject;
  notifications: Notification[];
}
