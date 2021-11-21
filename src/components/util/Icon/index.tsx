import { FC, FunctionComponent, ComponentClass, createElement } from 'react';

interface IconProps {
  className?: string;
  type: FunctionComponent | ComponentClass | string;
}

const Icon: FC<IconProps> = ({ className, type }) =>
  createElement<Partial<IconProps>>(type, { className });

export default Icon;
