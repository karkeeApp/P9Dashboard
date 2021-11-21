import update from 'immutability-helper';

// Redux Constants
import { AUTH_TOKEN, SIGNOUT, SET_USER } from '@/redux/constants/auth';

// Types
import { Action, AuthReducer } from '@/types/redux';

const initialState: AuthReducer = {
  currentUser: null,
};

export default function authReducer(
  state = initialState,
  action: Action,
): AuthReducer {
  switch (action.type) {
    case SET_USER:
      return update(state, {
        currentUser: {
          $set: (action as Action<AuthReducer['currentUser']>).payload,
        },
      });

    case SIGNOUT:
      localStorage.removeItem(AUTH_TOKEN);
      return update(state, {
        currentUser: {
          $set: null,
        },
      });

    default:
      return state;
  }
}
