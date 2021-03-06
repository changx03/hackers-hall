import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import About from './components/about'
import LoginContainer from './components/auth/loginContainer'
import RegistrationContainer from './components/auth/registrationContainer'
import NotFoundPage from './components/common/notFoundPage'
import MainContainer from './components/main'
import TimelineContainer from './components/timeline/timelineContainer'
import VotingResultsContainer from './components/votingResults/votingResultContainer'
import history from './history'

console.log(`NODE_ENV=${process.env.NODE_ENV}`)

const App = () => (
  <ConnectedRouter history={history}>
    <MainContainer>
      <Switch>
        <Route path="/" exact component={TimelineContainer} />
        <Route path="/login" component={LoginContainer} />
        <Route path="/register" component={RegistrationContainer} />
        <Route path="/about" component={About} />
        <Route path="/results" component={VotingResultsContainer} />
        <Route path="/timeline" component={TimelineContainer} />
        <Route path="/timeline/:event" component={TimelineContainer} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </MainContainer>
  </ConnectedRouter>
)

export default App
