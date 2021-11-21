import update from 'immutability-helper';

// Configs
import { THEME_CONFIG } from '@/configs/app';

// Redux Constants
import {
  TOGGLE_COLLAPSED_NAV,
  CHANGE_LOCALE,
  SIDE_NAV_STYLE_CHANGE,
  NAV_TYPE_CHANGE,
  TOP_NAV_COLOR_CHANGE,
  HEADER_NAV_COLOR_CHANGE,
  TOGGLE_MOBILE_NAV,
  SWITCH_THEME,
  DIRECTION_CHANGE,
} from '@/redux/constants/theme';

// Types
import { Action, ThemeReducer } from '@/types/redux';

const initialState: ThemeReducer = {
  ...(THEME_CONFIG as ThemeReducer),
};

const themeReducer = (
  state: ThemeReducer = initialState,
  action: Action,
): ThemeReducer => {
  switch (action.type) {
    case TOGGLE_COLLAPSED_NAV:
      return update(state, {
        navCollapsed: {
          $set: (action as Action<ThemeReducer['navCollapsed']>).payload,
        },
      });
    case SIDE_NAV_STYLE_CHANGE:
      return update(state, {
        sideNavTheme: {
          $set: (action as Action<ThemeReducer['sideNavTheme']>).payload,
        },
      });
    case CHANGE_LOCALE:
      return update(state, {
        locale: {
          $set: (action as Action<ThemeReducer['locale']>).payload,
        },
      });
    case NAV_TYPE_CHANGE:
      return update(state, {
        navType: {
          $set: (action as Action<ThemeReducer['navType']>).payload,
        },
      });
    case TOP_NAV_COLOR_CHANGE:
      return update(state, {
        topNavColor: {
          $set: (action as Action<ThemeReducer['topNavColor']>).payload,
        },
      });
    case HEADER_NAV_COLOR_CHANGE:
      return update(state, {
        headerNavColor: {
          $set: (action as Action<ThemeReducer['headerNavColor']>).payload,
        },
      });
    case TOGGLE_MOBILE_NAV:
      return update(state, {
        mobileNav: {
          $set: (action as Action<ThemeReducer['mobileNav']>).payload,
        },
      });
    case SWITCH_THEME:
      return update(state, {
        currentTheme: {
          $set: (action as Action<ThemeReducer['currentTheme']>).payload,
        },
      });
    case DIRECTION_CHANGE:
      return update(state, {
        direction: {
          $set: (action as Action<ThemeReducer['direction']>).payload,
        },
      });
    default:
      return state;
  }
};

export default themeReducer;
