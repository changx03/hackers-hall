# Node.js Server for Securing Node.js Web App

## Original file structure for server

- configurations
  - `apiRoutesConfig.js` - routes, cors middleware (done)
  - `sessionsManagementConfig.js` - session middleware using MongoDB store (done)
- data
  - `timelineItems-seed.js` - JSON data (done, exported as JSON instead)
  - `users.json` - JSON data (done)
- data_access
  - `connectionProvider.js` - MongoDB client (done)
  - `modelFactory.js` - Mongoose connection (skip)
  - `schemas.js` - Mongoose schemas (skip)
- routes
  - `authenticationRoutes.js` - route `/api/user`
  - `eventVoteRoutes.js` - route `/api/event` (done, untested)
  - `timelineRoutes.js` - route `/api/timeline` (done)
  - `wildcardRoute.js` - route `*`
- settings
  - `index.js`
- `initializationTasks.js` - includes initial seeding functions
  - `seedTimelineEvents()` (done)
  - `seedUsersAndVotes()` (done: Users, TODO: Votes)
  - `getRandomInt()`
- `server.js` - includes port, middlewares, static file directory, and listen function (done)
- `starting.js` - comments with colour (ignore)

## Setup database user

- Rename `.env.rename` file to `.env`
- Run the script from `./server/migration/dbscript.js` file in Mongo shell to create user

## Migration

### Usage

Utility functions for inserting demo data and creating indexes

To run the files

```bash
node ./migration/<filename>
```

## TODO list

- [x] Fix route
- [x] Added `express-validator` to `user` route
- [x] Added 1s delay to login response - preventing brute-force password attack
- [x] Added `login_attempts` table. The client can try to login up to 5 times with same IP and email
- [x] By default `express-session` uses name 'connect.sid'. We can make it less obvious what package we are using by providing a new `name`.
- [x] Added session-cookie generation demo
- [ ] Test voting

## Topics

### Session

- session data is **NOT** saved in the cookie itself, just the session ID. Session data is stored server-side
- `secure: true` - client will not send session back via **HTTP**, but only via **HTTPS**. <- Recommended, but `disable` during _development_
- session format: "s:" + sid + "." + "hash(secret)(sid)"

```javascript
const hash = crypto
  .createHmac('sha256', secret)
  .update(sid)
  .digest('base64')
  .replace(/=+$/, '')
const buildSession = encodeURIComponent('s:' + sid + '.' + hash)
```

- HTTPOnly - Cross-site Scripting (XSS)

#### Session TTL

`db.sessions.getIndexes()`

```json
{
  "key": {
    "expires": 1
  },
  "name": "expires_1",
  "ns": "hackers_hall.sessions",
  "expireAfterSeconds": 0
}
```

TTL (time-to-live) index expires after specific clock time

#### Recycled Sessions

- Reusing session for the same authentication will open a session fixation attack.
- New session should generate every time the user login
- Use `req.session.regenerate(err => {})` to generate new session
