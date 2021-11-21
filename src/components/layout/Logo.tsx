import { FC } from 'react';
import { Grid } from 'antd';

// Types
import { ThemeReducer } from '@/types/redux';

// Constants
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_TYPE_TOP,
} from '@/constants/theme';

// Configs
import { APP_NAME } from '@/configs/app';

// Custom Hooks
import { useTheme } from '@/hooks';

// Utils
import utils from '@/utils';

const { useBreakpoint } = Grid;

interface GetLogoWidthGutterParams {
  navCollapsed: ThemeReducer['navCollapsed'];
  navType: ThemeReducer['navType'];
  mobileLogo?: boolean;
}

function getLogoWidthGutter(
  { navCollapsed, navType, mobileLogo }: GetLogoWidthGutterParams,
  isMobile: boolean,
) {
  const isNavTop = navType === NAV_TYPE_TOP;
  if (isMobile && !mobileLogo) {
    return 0;
  }
  if (isNavTop) {
    return 'auto';
  }
  if (navCollapsed) {
    return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
  }
  return `${SIDE_NAV_WIDTH}px`;
}

// interface GetLogoParams {
//   navCollapsed: ThemeReducer['navCollapsed'];
//   logoType?: string;
// }

// const getLogo = ({ navCollapsed, logoType }: GetLogoParams): string => {
//   if (logoType === 'light') {
//     if (navCollapsed) {
//       return '/img/logo-sm-white.png';
//     }
//     return '/img/logo-white.png';
//   }

//   if (navCollapsed) {
//     return '/img/logo-sm.png';
//   }
//   return '/img/logo.png';
// };

const getLogoDisplay = (isMobile: boolean, mobileLogo?: boolean): string => {
  if (isMobile && !mobileLogo) {
    return 'd-none';
  }
  return 'logo';
};

interface LogoProps {
  // logoType?: string;
  mobileLogo?: boolean;
}

export const Logo: FC<LogoProps> = ({ mobileLogo }) => {
  const { navCollapsed, navType } = useTheme();
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
  return (
    <div
      className={getLogoDisplay(isMobile, mobileLogo)}
      style={{
        width: `${getLogoWidthGutter(
          { navCollapsed, navType, mobileLogo },
          isMobile,
        )}`,
      }}
    >
      <img
        src='/img/karkee-logo.png'
        alt={`${APP_NAME} logo`}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </div>
  );
};

export default Logo;
