import { combineReducers } from 'redux';

// Types
import { RootState } from '@/types/redux';

// Reducers
import themeReducer from './theme';
import authReducer from './auth';
import globalReducer from './global';

const reducers = combineReducers<RootState>({
  theme: themeReducer,
  auth: authReducer,
  global: globalReducer,
});

export default reducers;
