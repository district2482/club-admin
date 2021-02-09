// import SignIn from "./Components/Screen/SignIn";
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import MainLayout from './Components/Layout/MainLayout';
import VotingPollResults from './Components/Polls/VotingPollResults';
import VotingPollsView from './Components/Polls/VotingPollsView';
import LandingPage from './Components/Screen/LandingPage';
import LoginPage from "./Components/Screen/LoginPage";
import { PrivateRoute, ProvideAuth } from './Components/Security/Auth';
import VotingPoll from './Components/Polls/VotingPoll'
import { ConfirmProvider } from 'material-ui-confirm';
import VotingCodesListPage from './Components/Screen/VotingCodesListPage';

function App() {
  return (
    <ProvideAuth>
      <ConfirmProvider>
        <Router>
          <MainLayout>
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>

              <Route path="/clubs/:clubId/vote/:pollId">
                <VotingPoll />
              </Route>

              <Route path="/login">
                <LoginPage />
              </Route>

              <PrivateRoute exact path="/clubs/:clubId/voting-polls">
                <VotingPollsView />
              </PrivateRoute>

              <PrivateRoute path="/clubs/:clubId/voting-polls/:pollId">
                <VotingPollResults />
              </PrivateRoute>

              <PrivateRoute path="/clubs/:clubId/voting-codes/:pollId">
                <VotingCodesListPage />
              </PrivateRoute>

              <Route path="*">
                <NoMatch />
              </Route>

            </Switch>
          </MainLayout>

        </Router>
      </ConfirmProvider>
    </ProvideAuth>
  );
}

function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <h3>
        Страницата не е намерена: <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

export default App;
