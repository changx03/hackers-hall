import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import registrationReducer from './registrationReducer'
import timelineReducer from './timelineReducer'
import userDataReducer from './userDataReducer'
import voteReducer from './voteReducer'
import { reducer as formReducer } from 'redux-form'

const createRootReducer = history =>
  combineReducers({
    form: formReducer,
    loginState: loginReducer,
    registrationState: registrationReducer,
    router: connectRouter(history),
    timelineState: timelineReducer,
    userDataState: userDataReducer,
    votingResultsState: voteReducer,
  })

export default createRootReducer
