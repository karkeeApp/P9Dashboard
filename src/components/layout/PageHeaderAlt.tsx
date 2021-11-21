import {
  FC,
  useRef,
  useEffect,
  useState,
  ReactNode,
  CSSProperties,
} from 'react';
import clsx from 'clsx';

// Constants
import { NAV_TYPE_TOP } from '@/constants/theme';

// Custom Hooks
import { useTheme } from '@/hooks';

interface PageHeaderAltProps {
  children?: ReactNode;
  background?: string;
  className?: string;
  overlap?: boolean;
}

const PageHeaderAlt: FC<PageHeaderAltProps> = ({
  children,
  background,
  className,
  overlap,
}) => {
  const { navType } = useTheme();
  const [widthOffset, setWidthOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navType === NAV_TYPE_TOP) {
      const windowSize = window.innerWidth;

      if (ref.current) {
        const pageHeaderSize = ref.current.offsetWidth;
        setWidthOffset((windowSize - pageHeaderSize) / 2);
      }
    }
  }, [navType]);

  const getStyle = () => {
    const style: CSSProperties = {
      backgroundImage: background ? `url(${background})` : 'none',
    };
    if (navType === NAV_TYPE_TOP) {
      style.marginRight = -widthOffset;
      style.marginLeft = -widthOffset;
      style.paddingLeft = 0;
      style.paddingRight = 0;
    }
    return style;
  };

  return (
    <div
      // className={`page-header-alt ${className || ''} ${
      //   overlap && 'overlap'
      // }`}
      className={clsx(`page-header-alt`, className, overlap && 'overlap')}
      ref={ref}
      style={getStyle()}
    >
      {navType === NAV_TYPE_TOP ? (
        <div className='container'>{children}</div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default PageHeaderAlt;
