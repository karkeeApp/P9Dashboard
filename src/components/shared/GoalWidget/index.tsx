import { FC } from 'react';
import { Card, Progress, ProgressProps } from 'antd';

interface GoalWidgetProps {
  title: string;
  value: ProgressProps['percent'];
  size?: number;
  subtitle: string;
  strokeWidth?: ProgressProps['strokeWidth'];
  extra: string | JSX.Element;
}

const GoalWidget: FC<GoalWidgetProps> = ({
  title,
  value,
  size = 150,
  subtitle,
  strokeWidth = 4,
  extra,
}) => (
    <Card>
      <div className='text-center'>
        {title && <h4 className='mb-3 font-weight-bold'>{title}</h4>}
        <Progress
          type='dashboard'
          percent={value}
          width={size}
          strokeWidth={strokeWidth}
        />
        <div
          className={`mt-2 mx-auto text-muted ${extra ? 'mb-3' : ''}`}
          style={{ maxWidth: `${size + 30}px` }}
        >
          {subtitle}
        </div>
        {extra}
      </div>
    </Card>
  );

export default GoalWidget;
