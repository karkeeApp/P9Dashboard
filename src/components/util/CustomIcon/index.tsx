import { ComponentType, FC, forwardRef, SVGProps } from 'react';
import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

interface CustomIconProps {
  className?: string;
  svg: ComponentType<CustomIconComponentProps | SVGProps<SVGSVGElement>>;
}

const CustomIcon: FC<CustomIconProps> = forwardRef(({ className, svg }) => (
  <Icon component={svg} className={className} />
));

export default CustomIcon;
