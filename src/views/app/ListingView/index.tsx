import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import ListingListView from './ListingListView';
import ListingAddView from './ListingAddView';
import ListingEditView from './ListingEditView';
import ListingDetailsView from './ListingDetailsView';

const ListingView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={ListingListView} />
    <Route path={`${match.url}/add`} component={ListingAddView} />
    <Route path={`${match.url}/edit/:id`} component={ListingEditView} />
    <Route path={`${match.url}/:id`} component={ListingDetailsView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default ListingView;
