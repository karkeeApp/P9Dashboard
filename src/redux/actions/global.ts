// Types
import { Action, GlobalReducer } from '@/types/redux';

// Redux Constants
import {
  SET_GLOBAL,
  SET_GLOBAL_INTERNET,
  SET_GLOBAL_SETTINGS,
  SET_GLOBAL_OPTIONS,
  SET_GLOBAL_NOTIFICATIONS,
} from '@/redux/constants/global';

export function setGlobal(global: GlobalReducer): Action<GlobalReducer> {
  return {
    type: SET_GLOBAL,
    payload: global,
  };
}

export function setGlobalInternet(
  internet: GlobalReducer['internet'],
): Action<GlobalReducer['internet']> {
  return {
    type: SET_GLOBAL_INTERNET,
    payload: internet,
  };
}

export function setGlobalSettings(
  settings: GlobalReducer['settings'],
): Action<GlobalReducer['settings']> {
  return {
    type: SET_GLOBAL_SETTINGS,
    payload: settings,
  };
}

export function setGlobalOptions(
  options: GlobalReducer['options'],
): Action<GlobalReducer['options']> {
  return {
    type: SET_GLOBAL_OPTIONS,
    payload: options,
  };
}

export function setGlobalNotifications(
  notifications: GlobalReducer['notifications'],
): Action<GlobalReducer['notifications']> {
  return {
    type: SET_GLOBAL_NOTIFICATIONS,
    payload: notifications,
  };
}
