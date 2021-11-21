import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import AdminListView from './AdminListView';
import AdminAddView from './AdminAddView';
import AdminEditView from './AdminEditView';
import AdminDetailsView from './AdminDetailsView';

const AdminView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={AdminListView} />
    <Route path={`${match.url}/add`} component={AdminAddView} />
    <Route path={`${match.url}/edit/:id`} component={AdminEditView} />
    <Route path={`${match.url}/:id`} component={AdminDetailsView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default AdminView;
