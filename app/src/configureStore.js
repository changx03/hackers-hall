import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { isServer } from '../appSettings'
import createRootReducer from './reducers/reducers'

let history

console.log(`Is server? ${isServer}`)

export function getHistory(url = '/') {
  if (!history) {
    history = isServer ? createMemoryHistory({ initialEntries: [url] }) : createBrowserHistory()
  }
  return history
}

const composeEnhancers = isServer ? compose : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(getHistory()),
    preloadedState,
    composeEnhancers(applyMiddleware(routerMiddleware(history), thunk))
  )
  return store
}

export default configureStore
