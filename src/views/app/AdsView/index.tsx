import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import AdsListView from './AdsListView';
import AdsAddView from './AdsAddView';
import AdsEditView from './AdsEditView';
import AdsDetailsView from './AdsDetailsView';

const AdView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={AdsListView} />
    <Route path={`${match.url}/add`} component={AdsAddView} />
    <Route path={`${match.url}/edit/:id`} component={AdsEditView} />
    <Route path={`${match.url}/:id`} component={AdsDetailsView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default AdView;
