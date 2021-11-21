import { FC, CSSProperties } from 'react';

interface FlexProps {
  className?: string;
  alignItems?:
    | 'start'
    | 'end'
    | 'center'
    | 'baseline'
    | 'stretch'
    | 'sm-start'
    | 'sm-end'
    | 'sm-center'
    | 'sm-baseline'
    | 'sm-stretch'
    | 'md-start'
    | 'md-end'
    | 'md-center'
    | 'md-baseline'
    | 'md-stretch'
    | 'lg-start'
    | 'lg-end'
    | 'lg-center'
    | 'lg-baseline'
    | 'lg-stretch'
    | 'xl-start'
    | 'xl-end'
    | 'xl-center'
    | 'xl-baseline'
    | 'xl-stretch';
  flexDirection?:
    | 'row'
    | 'column'
    | 'row-reverse'
    | 'column-reverse'
    | 'wrap'
    | 'nowrap'
    | 'wrap-reverse'
    | 'fill'
    | 'grow-0'
    | 'grow-1'
    | 'shrink-0'
    | 'shrink-1';
  justifyContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'between'
    | 'around'
    | 'sm-start'
    | 'sm-start'
    | 'sm-end'
    | 'sm-center'
    | 'sm-between'
    | 'sm-around'
    | 'md-start'
    | 'md-start'
    | 'md-end'
    | 'md-center'
    | 'md-between'
    | 'md-around'
    | 'lg-start'
    | 'lg-start'
    | 'lg-end'
    | 'lg-center'
    | 'lg-between'
    | 'lg-around'
    | 'xl-start'
    | 'xl-start'
    | 'xl-end'
    | 'xl-center'
    | 'xl-between'
    | 'xl-around';
  mobileFlex?: boolean;
  style?: CSSProperties;
}

const Flex: FC<FlexProps> = ({
  children,
  className = '',
  alignItems,
  justifyContent,
  mobileFlex = true,
  flexDirection = 'row',
  style,
}) => {
  const getFlexResponsive = () => (mobileFlex ? 'd-flex' : 'd-md-flex');

  return (
    <div
      className={`${getFlexResponsive()} ${className} ${
        flexDirection ? `flex-${flexDirection}` : ''
      } ${alignItems ? `align-items-${alignItems}` : ''} ${
        justifyContent ? `justify-content-${justifyContent}` : ''
      }`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Flex;
