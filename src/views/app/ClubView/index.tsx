import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import ClubListView from './ClubListView';
import ClubAddView from './ClubAddView';
import ClubEditView from './ClubEditView';
import ClubDetailsView from './ClubDetailsView';

const PaymentView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={ClubListView} />
    <Route path={`${match.url}/add`} component={ClubAddView} />
    <Route path={`${match.url}/edit/:id`} component={ClubEditView} />
    <Route path={`${match.url}/:id`} component={ClubDetailsView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default PaymentView;
