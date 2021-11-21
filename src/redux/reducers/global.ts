import update from 'immutability-helper';

// Redux Constants
import {
  SET_GLOBAL,
  SET_GLOBAL_INTERNET,
  SET_GLOBAL_SETTINGS,
  SET_GLOBAL_OPTIONS,
  SET_GLOBAL_NOTIFICATIONS,
} from '@/redux/constants/global';

// Types
import { Action, GlobalReducer } from '@/types/redux';

const initialState: GlobalReducer = {
  internet: {
    status: 'online',
  },
  settings: {
    user_roles: [],
    user_status: [],
    sponsor_levels: [],
    member_types: [],
    club_status: [],
    ads_status: [],
    ads_states: [],
    banner_status: [],
    news_status: [],
    news_categories: [],
    event_status: [],
    attendee_status: [],
    listing_status: [],
    account_membership_status: [],
    payment_for: [],
    payment_status: [],
  },
  options: {
    owner_options: [],
    relationships: [],
    salaries: [],
  },
  notifications: [],
};

export default function globalReducer(
  state = initialState,
  action: Action,
): GlobalReducer {
  switch (action.type) {
    case SET_GLOBAL:
      return { ...state, ...(action as Action<GlobalReducer>).payload };

    case SET_GLOBAL_INTERNET:
      return update(state, {
        internet: {
          $set: (action as Action<GlobalReducer['internet']>).payload,
        },
      });

    case SET_GLOBAL_SETTINGS:
      return update(state, {
        settings: {
          $set: (action as Action<GlobalReducer['settings']>).payload,
        },
      });

    case SET_GLOBAL_OPTIONS:
      return update(state, {
        options: {
          $set: (action as Action<GlobalReducer['options']>).payload,
        },
      });

    case SET_GLOBAL_NOTIFICATIONS:
      return update(state, {
        notifications: {
          $set: (action as Action<GlobalReducer['notifications']>).payload,
        },
      });

    default:
      return state;
  }
}
