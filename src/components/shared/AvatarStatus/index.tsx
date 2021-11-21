import { FC } from 'react';
import { Avatar, AvatarProps } from 'antd';
import clsx from 'clsx';

interface AvatarStatusProps extends AvatarProps {
  name: string;
  src: string;
  suffix?: string;
  subTitle?: string;
  text?: string;
  onNameClick?: () => void | Promise<void>;
}

const AvatarStatus: FC<AvatarStatusProps> = ({
  name,
  suffix,
  subTitle,
  src,
  icon,
  size,
  shape,
  gap,
  text,
  onNameClick,
}) => (
  <div
    className={clsx(
      'avatar-status',
      'd-flex',
      'align-items-center',
      'p-2',
      onNameClick && 'clickable',
    )}
    onClick={onNameClick}
    role='none'
  >
    <Avatar icon={icon} src={src} size={size} shape={shape} gap={gap}>
      {text}
    </Avatar>
    <div className='ml-2'>
      <div>
        <div className='avatar-status-name'>{name}</div>
        <span>{suffix}</span>
      </div>
      <div className='text-muted avatar-status-subtitle'>{subTitle}</div>
    </div>
  </div>
);

export default AvatarStatus;
