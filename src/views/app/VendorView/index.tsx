import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import VendorListView from './VendorListView';
import VendorAddView from './VendorAddView';
import VendorEditView from './VendorEditView';
import VendorDetailsView from './VendorDetailsView';

const VendorView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={VendorListView} />
    <Route path={`${match.url}/add`} component={VendorAddView} />
    <Route path={`${match.url}/edit/:id`} component={VendorEditView} />
    <Route path={`${match.url}/:id`} component={VendorDetailsView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default VendorView;
