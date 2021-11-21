// Types
import { Action, AuthReducer } from '@/types/redux';

// Redux Constants
import { SET_USER } from '@/redux/constants/auth';

export function setUser(
  user: AuthReducer['currentUser'],
): Action<AuthReducer['currentUser']> {
  return {
    type: SET_USER,
    payload: user,
  };
}
