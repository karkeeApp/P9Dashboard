import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import BannerListView from './BannerListView';
import BannerAddView from './BannerAddView';
import BannerEditView from './BannerEditView';
import BannerDetailsView from './BannerDetailsView';

const BannerView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={BannerListView} />
    <Route path={`${match.url}/add`} component={BannerAddView} />
    <Route path={`${match.url}/edit/:id`} component={BannerEditView} />
    <Route path={`${match.url}/:id`} component={BannerDetailsView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default BannerView;
