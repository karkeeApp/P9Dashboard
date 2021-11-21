import { FC } from 'react';
import { Card, Result, Button } from 'antd';

const NoInternetConnectionCard: FC = () => {
  const handleRetryInternetConnection = () => {
    window.location.reload();
  };

  return (
    <Card>
      <Result
        status='error'
        title='Connection Failed'
        subTitle='Make sure you have stable internet connection.'
        extra={[
          <Button type='primary' onClick={handleRetryInternetConnection}>
            Try Again
          </Button>,
        ]}
      />
    </Card>
  );
};

export default NoInternetConnectionCard;
