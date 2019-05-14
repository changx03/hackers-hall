import configureStore from '../../../app/src/configureStore'
import EventVotesDAO from '../db/EventVotesDAO'

function renderFullPage(preloadedState) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Hacker's Hall</title>
  <link rel="shortcut icon" href="favicon.ico?ver=1" />
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
  <link rel="stylesheet" type="text/css" href="./shared/toastr.min.css">
  <link rel="stylesheet" type="text/css" href="./shared/vis.min.css">
  <link rel="stylesheet" type="text/css" href="./shared/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="./shared/react-datepicker.min.css">
  <link href="main.css" rel="stylesheet"></head>
<body>
  <div id="app"></div>
  <script>
    // WARNING: See the following for security issues around embedding JSON in HTML:
    // http://redux.js.org/recipes/ServerRendering.html#security-considerations
    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script type="text/javascript" src="./shared/jquery.min.js"></script>
  <script type="text/javascript" src="./shared/toastr.min.js"></script>
  <script type="text/javascript" src="./shared/bootstrap.min.js"></script>
  <script type="text/javascript" src="./shared/vis.min.js" ></script>
<script type="text/javascript" src="bundle.js"></script></body>
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

  const store = configureStore({ userDataState: { user, votes } })
  const finalState = store.getState()
  res.send(renderFullPage(finalState))
}
