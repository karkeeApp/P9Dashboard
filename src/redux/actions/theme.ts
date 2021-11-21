// Types
import { Action, ThemeReducer } from '@/types/redux';

// Redux Constants
import {
  TOGGLE_COLLAPSED_NAV,
  SIDE_NAV_STYLE_CHANGE,
  CHANGE_LOCALE,
  NAV_TYPE_CHANGE,
  TOP_NAV_COLOR_CHANGE,
  HEADER_NAV_COLOR_CHANGE,
  TOGGLE_MOBILE_NAV,
  SWITCH_THEME,
  DIRECTION_CHANGE,
} from '@/redux/constants/theme';

export function toggleCollapsedNav(
  navCollapsed: boolean,
): Action<ThemeReducer['navCollapsed']> {
  return {
    type: TOGGLE_COLLAPSED_NAV,
    payload: navCollapsed,
  };
}

export function onNavStyleChange(
  sideNavTheme: ThemeReducer['sideNavTheme'],
): Action<ThemeReducer['sideNavTheme']> {
  return {
    type: SIDE_NAV_STYLE_CHANGE,
    payload: sideNavTheme,
  };
}

export function onLocaleChange(
  locale: ThemeReducer['locale'],
): Action<ThemeReducer['locale']> {
  return {
    type: CHANGE_LOCALE,
    payload: locale,
  };
}

export function onNavTypeChange(
  navType: ThemeReducer['navType'],
): Action<ThemeReducer['navType']> {
  return {
    type: NAV_TYPE_CHANGE,
    payload: navType,
  };
}

export function onTopNavColorChange(
  topNavColor: ThemeReducer['topNavColor'],
): Action<ThemeReducer['topNavColor']> {
  return {
    type: TOP_NAV_COLOR_CHANGE,
    payload: topNavColor,
  };
}

export function onHeaderNavColorChange(
  headerNavColor: ThemeReducer['headerNavColor'],
): Action<ThemeReducer['headerNavColor']> {
  return {
    type: HEADER_NAV_COLOR_CHANGE,
    payload: headerNavColor,
  };
}

export function onMobileNavToggle(
  mobileNav: ThemeReducer['mobileNav'],
): Action<ThemeReducer['mobileNav']> {
  return {
    type: TOGGLE_MOBILE_NAV,
    payload: mobileNav,
  };
}

export function onSwitchTheme(
  currentTheme: ThemeReducer['currentTheme'],
): Action<ThemeReducer['currentTheme']> {
  return {
    type: SWITCH_THEME,
    payload: currentTheme,
  };
}

export function onDirectionChange(
  direction: ThemeReducer['direction'],
): Action<ThemeReducer['direction']> {
  return {
    type: DIRECTION_CHANGE,
    payload: direction,
  };
}
