import { useSelector } from 'react-redux';

// Types
import { RootState, AuthReducer } from '@/types/redux';

export default function useAuth(): AuthReducer {
  return useSelector((state: RootState) => state.auth);
}
