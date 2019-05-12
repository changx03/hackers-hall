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

- Fix route
- Test voting
