require('@babel/register')
require('dotenv').config()
process.env.NODE_ENV = 'development'

const MongoClient = require('mongodb').MongoClient
const chalk = require('chalk').default
const config = require('../config/config').default
const collections = require('../config/constant').collections
const data = require('../data/timeline_items.json')

console.log(`Connecting to ${config.dbUriAdmin}`)

MongoClient.connect(config.dbUriAdmin, {
  useNewUrlParser: true
})
  .then(async client => {
    const db = client.db(config.database)
    const timelineItems = await db.collection(collections.TimelineItems)
    const count = await timelineItems.count()
    if (count === 0) {
      const res = await timelineItems.insertMany(data)
      console.log(chalk.green(`Inserted ${res.insertedCount} documents`))
    } else {
      console.log(
        chalk.yellow(`${collections.TimelineItems} is not empty.
Do you want to delete current documents first?`)
      )
    }
    client.close()
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
