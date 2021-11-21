import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import NewsListView from './NewsListView';
import NewsAddView from './NewsAddView';
import NewsEditView from './NewsEditView';
import NewsDetailsView from './NewsDetailsView';

const NewsView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={NewsListView} />
    <Route path={`${match.url}/add`} component={NewsAddView} />
    <Route path={`${match.url}/edit/:id`} component={NewsEditView} />
    <Route path={`${match.url}/:id`} component={NewsDetailsView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default NewsView;
