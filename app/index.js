import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './src/app'
import configureStore from './src/configureStore'

const preloadedState = window.__PRELOADED_STATE__ || {}
delete window.__PRELOADED_STATE__
const store = configureStore(preloadedState)

ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById('app')
)
