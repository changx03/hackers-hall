import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import EventVotesDAO from '../db/EventVotesDAO'

/******************************************************************************/
// TODO: place holder for react app
const reducer = function(state) {
  return state
}
const App = () => <div>Hello world!</div>
/******************************************************************************/

function renderFullPage(html, preloadedState) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Hacker's Hall</title>
  <link rel="shortcut icon" href="favicon.ico?ver=1" />
        <link rel="stylesheet" href="styles.css" type="text/css">
</head>
<body>
  <div id="app">${html}</div>
  <script>
    // WARNING: See the following for security issues around embedding JSON in HTML:
    // http://redux.js.org/recipes/ServerRendering.html#security-considerations
    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
  </script>
  <script src="/static/bundle.js"></script>
  <script src="https://code.jquery.com/jquery-2.2.3.min.js" crossorigin="anonymous"></script>
</body>
</html>
`
}

export async function reactRender(req, res) {
  // the initial state is loaded from session
  let user = {}
  let votes = []
  if (req.user) {
    user = req.user
    try {
      votes = await EventVotesDAO.getUsersVotes(user)
    } catch (e) {
      console.error(e.message)
    }
  }
  const store = createStore(reducer, { userDataState: { user, votes } }, applyMiddleware(thunk))
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )
  const finalState = store.getState()
  console.log(finalState)
  res.send(renderFullPage(html, finalState))
}
