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
- Use `node ./server/migration/genRandStr.js 16` to generate 16 characters password
- Run the script from `./server/migration/dbscript.js` file in Mongo shell to create user
- Run `node ./server/migration/insertTimelineItems.js` to insert `timeline_items` collection
- Run `node ./server/migration/createIndexUsers.js` to create indexes in `users` collection
- Run `node ./server/migration/createIndexTimelineItems.js` to create indexes in `timeline_items` collection
- Run `node ./server/migration/createIndexLoginAttempt.js` to create indexes in `login_attempts` collection
- Run `node ./server/migration/timelineItemsDateUpdate.js` to convert date string to Date
- Run `yarn start` to start the server

## Migration

### Usage

Utility functions for inserting demo data and creating indexes

To run the files

```bash
node ./migration/<filename>
```

## TODO list

- [x] Fix route
- [x] In vote DAO, replaced `find()` to `findMany()`. `find()` returns a cursor instead of array!
- [x] Disable `HtmlWebpackPlugin`, so server send server rendered page to client
- [ ] Test voting

## Topics

- [x] Added `express-validator` to `user` route
- [x] Added 1s delay to login response - preventing brute-force password attack
- [x] Added `login_attempts` table. The client can try to login up to 5 times with same IP and email
- [x] By default `express-session` uses name 'connect.sid'. We can make it less obvious what package we are using by providing a new `name`.

### Session

- [x] Added session-cookie generation demo
- [x] set `httpOnly` to `true` <- prevent cookie leak

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

#### Re-authorization

e.g. asking client to login when placing orders

#### Session security summary

- Protecting the session ID
- Time-limited sessions
- New session on authentication
- HTTPOnly flagged cookies
- Transport layer security
- Secure flagged cookies

### Testing tools

- Fiddler
- Burp Suite

### Database security - securing MongoDB from injection attacks

#### Testing query string

http://localhost:8080/api/timeline?startDate="');return true;}+//2000-01-03T00:00:00.000Z&endDate=2010-01-01T00:00:00.000Z

http://localhost:8080/api/timeline?startDate="')2000-01-03T00:00:00.000Z&endDate=2010-01-01T00:00:00.000Z

#### MongoDB query example

```javascript
db.products.find({ $where: `this.name==${user - input}` })
```

- \$where
- map-reduce
- group command

Code vulnerable to injection attack

```javascript
const query = {$where: "this.hidden == false"};
if (startDate && endDate) {
  query['$where'] =
    "this.start >= new Date('" + startDate + "') && " +
    "this.end <= new Date('" + endDate + "') &&" + 'this.hidden == false;'
}
const TimelineItem = await getTimelineItemModel();
const timelineItems = await TimelineItem.find(query);

// when startDate="');return true;}+//...
query = {$where: "this.start >= new Date('" + "'); return true; } // comments..."}
```

#### MongoDB config file

disable query execute javascript

```markdown
security:
  javascriptEnabled: false
```

#### Adding query checking in application level

Checking query parameter with `express-validator` before it passes into MongoDB

#### Summary

- NoSql may still venerable to SQL injection attach
- Injection demonstration with Burp Suite
- MongoDB javascript injection attacks
- Handling untrusted data

### Handling untrusted data

#### Zed Attack Proxy

OWASP zaproxy

Setup ZAP to send exploit requests

- To listen localhost, change port from Zap->Options->Local Proxies
- Send an API request (register a new user)
- Right click payload, choose **fuzz**
- Highlight the content, click **Add**
- *Add payload*, type: *File Fuzzers*, `jbrofuzz` -> Exploits, SQL Injection
- *Start Fuzzer*

#### Identifying untrusted data

Which one should we trust?

- [ ] Form input values
- [ ] *User-Agent* HTTP request header
- [ ] `<input type="hidden" value="X3gAAOZ...">` server-side injected hidden data <- Can't trusted!
- [ ] Data from application database <- Can't fully trusted!

1. Any data that is explicitly being supplied from an external source cannot be trusted (e.g. HTTP header can be anything!)
1. If the data has crossed a trust boundary, it cannot be trusted.
1. Be cognitive of who has access to the data
1. Internal resource/threats (Web app, database, web service, admin/DBA)

#### API pipeline

Request -> Middleware -> Route Handler -> Database

Multilayer Approach - Data should validate in each checkpoint

Keep untrusted data as far away from critical systems as possible.

#### Blacklist Approach

Blacklist

```
<script>
$%&!;'"`
1,2,3
&nbsp;
```

`&nbsp;` **non-breakable space**

Whitelist

```
A-Z
a-z
0-9
```

#### Escaping Untrusted Data

***Escaping** simply lets the interpreter know that the data is not intended to be executed, and therefore prevents attacks from working.

\<script\> -> interpreter -> Data "\&lt;script\&gt;"

Example: escaping HTML

```
THe <body> element...
```

Escaping rules are specific to an interpreter

HTML - interpreter rules
CSS - interpreter rules
JavaScript - interpreter rules

Applying the wrong rules on the wrong context opens up the risk of **cross-site scripting**

#### Sanitizing

Sanitize the data by removing known values to be potentially malicious in order to make the data safe.

Issues with sanitizing

- Blacklist approach
- Maintenance requirements
- Context bound
- Potentially inadequate

#### Access controls

- Principle of Least Privilege
- Role based access control

Absolutely minimal: enable security.authorization in mongod

Role based users should only able to access certain collection, not the entire database
