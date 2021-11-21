import { useSelector } from 'react-redux';

// Types
import { RootState, GlobalReducer } from '@/types/redux';

export default function useGlobal(): GlobalReducer {
  return useSelector<RootState, GlobalReducer>((state) => state.global);
}
