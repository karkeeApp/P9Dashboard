import { FC } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

// Views
import PaymentListView from './PaymentListView';
import PaymentAddView from './PaymentAddView';
import PaymentEditView from './PaymentEditView';
import PaymentDetailsView from './PaymentDetailsView';

const PaymentView: FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/list`} component={PaymentListView} />
    <Route path={`${match.url}/add`} component={PaymentAddView} />
    <Route path={`${match.url}/edit/:id`} component={PaymentEditView} />
    <Route path={`${match.url}/:id`} component={PaymentDetailsView} />
    <Redirect from={match.url} to={`${match.url}/list`} />
  </Switch>
);

export default PaymentView;
