import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import UserListView from './UserListView';
import UserAddView from './UserAddView';
import UserEditView from './UserEditView';
import UserDetailsView from './UserDetailsView';

const MemberView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={UserListView} />
    <Route path={`${match.url}/add`} component={UserAddView} />
    <Route path={`${match.url}/edit/:id`} component={UserEditView} />
    <Route path={`${match.url}/:id`} component={UserDetailsView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default MemberView;
