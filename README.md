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
const query = { $where: 'this.hidden == false' }
if (startDate && endDate) {
  query['$where'] =
    "this.start >= new Date('" +
    startDate +
    "') && " +
    "this.end <= new Date('" +
    endDate +
    "') &&" +
    'this.hidden == false;'
}
const TimelineItem = await getTimelineItemModel()
const timelineItems = await TimelineItem.find(query)

// when startDate="');return true;}+//...
query = { $where: "this.start >= new Date('" + "'); return true; } // comments..." }
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
- _Add payload_, type: _File Fuzzers_, `jbrofuzz` -> Exploits, SQL Injection
- _Start Fuzzer_

#### Identifying untrusted data

Which one should we trust?

- [ ] Form input values
- [ ] _User-Agent_ HTTP request header
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

**\*Escaping** simply lets the interpreter know that the data is not intended to be executed, and therefore prevents attacks from working.

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

### Access controls

- Principle of Least Privilege
- Role based access control
  - Database role control
  - User based role control

Absolutely minimal: enable security.authorization in mongod

#### Scenario: Creating custom MongoDB role

The MongoDB client for accessing _timeline_items_ should not able to delete or write on _users_ collection

Role based users should only able to access certain collection, not the entire database

```javascript
// read MongoDB users from a JSON file
const accounts = JSON.parse(fs.readFileAsync('db.config.json', 'utf-8'))
```

#### Problem for running aggregation function

Providing **read-only** right to the _role_

#### Server-side function level control failure

- Client-side validation is untrusted.

#### Access Control Misconfiguration

##### Scenario: Only checking using right in `get` request

- User right is only check within `.get()`.
- Using `.all((req, res, next) => { /* Check user right */ })` to cover all HTTP requests

### Defending Against Cross-site Scripting (XSS)

#### Demo: a malicious link from email can send your session-cookie to 3rd party

#### Scenario: the search result display on the page

```
.../timeline?search=<script>alert(document.cookie)</script>
```

#### Reflective Cross-site Scripting (XSS)

Victim's cookies send back to attacker through crafted URL (execute JavaScript)

#### Persistent Cross-site Scripting

##### Scenario: Using script as name

Attacker registered as a standard user, and saved the display name with a crafted malicious script.
When the administrator visit user list, the script runs and send administrator's cookie to the attacker's URL

##### Common Scenario: Executing script inside comment section

The comment section in a blogger allows user to input html element. Everyone visiting the page that renders this comment will run the script in background.

### DOM based Cross-Site Scripting

- `cookie.httpOnly: true` will block all script to access the cookie

- The execution always comes from the client

### `Content-Security-Policy` header

```
<header>: <directive> <value>;
Content-Security-Policy: script-src 'self';
```

[Content Security Policy explained by helmet documentation](https://helmetjs.github.io/docs/csp/)

Inline code and `eval()` are considered harmful.
[Google developers Web Fundamentals - Content Security Policy](https://developers.google.com/web/fundamentals/security/csp/)

#### Example

- If I can run JavaScript on your page, I can do a lot of bad things, from stealing authentication cookies to logging every user action.
- **Tracking pixel**: If I could put a tiny, transparent 1x1 image on your site, I could get a pretty good idea of how much traffic your site gets.

### `X-XSS-PROTECTION` filter header

```
X-XSS-PROTECTION: 1;mode=block
```

### `helmet` node package

[Helmet documentation](https://helmetjs.github.io/docs/)

#### Included by default

- dnsPrefetchControl
- frameguard
- hidePoweredBy
- hsts
- ieNoOpen
- noSniff
- xssFilter

#### Not include but should switch on

- contentSecurityPolicy

#### `noSniff` - Don't Sniff Mimetype

##### Scenario: Execute HTML file as image

The attacker could upload an image with the .jpg file extension but its contents are actually HTML. Visiting that image could cause the browser to “run” the HTML page, which could contain malicious JavaScript!

### `xss-filters` Escaping untrusted data

```javascript
import { inHTMLData } from 'xss-filters'
console.log(inHTMLDate('<script src="dist/xss-filters.min.js"></script>'))
```

#### Reasons to Perform Escaping **Prior to Using**

- Helps avoid double encoding
- Avoids data lose through truncation
- Greater flexibility of data
- Less prone to errors

### `XSS` Sanitize untrusted HTML (to prevent XSS)

https://www.npmjs.com/package/xss

### `validate`

https://www.npmjs.com/package/validate
