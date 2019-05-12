const path = require('path')
// applying runtime babel transform
require('@babel/register')({
  configFile: path.resolve(__dirname, '../../babel.server.config.js')
})
require('dotenv').config()
process.env.NODE_ENV = 'development'

const MongoClient = require('mongodb').MongoClient
const chalk = require('chalk').default
const config = require('../config/config').default
const collections = require('../config/constant').collections
const data = require('../data/users.json')

console.log(`Connecting to ${config.dbUriAdmin}`)

MongoClient.connect(config.dbUriAdmin, {
  useNewUrlParser: true
})
  .then(async client => {
    const db = client.db(config.database)
    const users = await db.collection(collections.Users)
    const count = await users.count()
    if (count === 0) {
      const res = await users.insertMany(data)
      console.log(chalk.green(`Inserted ${res.insertedCount} documents`))
    } else {
      console.log(
        chalk.yellow(`${collections.Users} is not empty.
Do you want to delete current documents first?`)
      )
    }
    client.close()
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
