/* eslint-disable */

// The script in this file should run from mongo shell
// Run it before starting the server the first time
// Change user name and password according

// bash
// $ mongo admin -u <user> -p <pwd>

// > show dbs

db.createUser({
  user: 'securing-app-user',
  pwd: '<pwd>',
  roles: [{ role: 'readWrite', db: 'hackers_hall' }]
})

db.createUser({
  user: 'securing-app-admin',
  pwd: '<pwd>',
  roles: [
    { role: 'dbAdmin', db: 'hackers_hall' },
    { role: 'readWrite', db: 'hackers_hall' }
  ]
})

// > exit

// login with admin user
// $ mongo hackers_hall -u "securing-app-admin" -p <pwd> --authenticationDatabase admin

db.createCollection('test')
// > show dbs
// > show collections
