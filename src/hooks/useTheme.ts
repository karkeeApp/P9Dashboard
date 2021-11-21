import { useSelector } from 'react-redux';

// Types
import { RootState, ThemeReducer } from '@/types/redux';

export default function useTheme(): ThemeReducer {
  return useSelector((state: RootState) => state.theme);
}
