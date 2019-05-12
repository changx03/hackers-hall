const path = require('path')
// applying runtime babel transform
require('@babel/register')({
  configFile: path.resolve(__dirname, '../../babel.server.config.js')
})
require('dotenv').config()
process.env.NODE_ENV = 'development'

const MongoClient = require('mongodb').MongoClient
const chalk = require('chalk').default
const config = require('../../config/config').default
const collections = require('../../config/constant').collections

console.log(`Connecting to ${config.dbUriAdmin}`)

MongoClient.connect(config.dbUriAdmin, {
  useNewUrlParser: true
})
  .then(async client => {
    const db = client.db(config.database)
    const timelineItems = await db.collection(collections.TimelineItems)
    const res = await timelineItems.createIndex({ start: 1, end: 1 })
    console.log(chalk.green(res))

    client.close()
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
