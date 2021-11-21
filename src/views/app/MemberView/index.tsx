import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import MemberListView from './MemberListView';
import MemberAddView from './MemberAddView';
import MemberEditView from './MemberEditView';
import MemberDetailsView from './MemberDetailsView';

const MemberView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={MemberListView} />
    <Route path={`${match.url}/add`} component={MemberAddView} />
    <Route path={`${match.url}/edit/:id`} component={MemberEditView} />
    <Route path={`${match.url}/:id`} component={MemberDetailsView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default MemberView;
