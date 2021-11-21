import { FC } from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';

// Configs
import { APP_PREFIX_PATH } from '@/configs/app';

const HomeView: FC<RouteComponentProps> = ({ match }) => (
  <Redirect exact from={match.url} to={`${APP_PREFIX_PATH}/ads`} />
);

export default HomeView;
