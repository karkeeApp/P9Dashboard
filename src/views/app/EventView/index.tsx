import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import EventListView from './EventListView';
import EventAddView from './EventAddView';
import EventEditView from './EventEditView';
import EventDetailsView from './EventDetailsView';

const EventView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={EventListView} />
    <Route path={`${match.url}/add`} component={EventAddView} />
    <Route path={`${match.url}/edit/:id`} component={EventEditView} />
    <Route path={`${match.url}/:id`} component={EventDetailsView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default EventView;
