import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './src/app'
import configureStore from './src/configureStore'
import './src/css/index.scss'

let preloadedState = {}

if (window && window.__PRELOADED_STATE__) {
  preloadedState = window.__PRELOADED_STATE__
  delete window.__PRELOADED_STATE__
}

const store = configureStore(preloadedState)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
