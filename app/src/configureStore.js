import { routerMiddleware } from 'connected-react-router'
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import history from './history'
import createRootReducer from './reducers/reducers'

const composeEnhancers = window ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose

function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancers(applyMiddleware(routerMiddleware(history), thunk))
  )
  return store
}

export default configureStore
