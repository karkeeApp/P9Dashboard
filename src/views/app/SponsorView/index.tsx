import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import SponsorListView from './SponsorListView';

const SponsorView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={SponsorListView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default SponsorView;
