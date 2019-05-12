const path = require('path')
// applying runtime babel transform
require('@babel/register')({
  configFile: path.resolve(__dirname, '../../babel.server.config.js')
})
require('dotenv').config()
process.env.NODE_ENV = 'development'

const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const chalk = require('chalk').default
const config = require('../config/config').default
const collections = require('../config/constant').collections

console.log(`Connecting to ${config.dbUriAdmin}`)

/**
 * The date for start and end are string,
 * This utility function helps convert them to Date
 */

// parse MM-DD-YYYY to YYYY-MM-DD format
function dateParser(dateString) {
  const d = dateString.split('-')
  const date = `${d[2]}-${d[0]}-${d[1]}`
  return date
}

async function updateDate(collection, fieldName) {
  const query = {}
  query[fieldName] = { $exists: true, $type: 'string' }
  const options = {
    projection: {}
  }
  options.projection[fieldName] = 1

  const cursor = await collection
  .find(query, options)
  .toArray()

  const migrate = cursor.map(document => {
    return {
      updateOne: {
        filter: { _id: ObjectId(document._id) },
        update: {
          $set: {
            [fieldName]: new Date(Date.parse(dateParser(document[fieldName])))
          }
        }
      }
    }
  })

  console.log(chalk.green(`Found ${fieldName} in ${migrate.length} documents to update`))
  if (migrate.length === 0) {
    return
  }
  const { modifiedCount } = await collection.bulkWrite(migrate, { ordered: false })
  console.log(chalk.green(`${modifiedCount} documents updated`))
}

MongoClient.connect(config.dbUriAdmin, {
  useNewUrlParser: true
})
  .then(async client => {
    const db = client.db(config.database)
    const timelineItems = await db.collection(collections.TimelineItems)
    const count = await timelineItems.countDocuments()
    if (count === 0) {
      console.log(chalk.red('There is nothing to update'))
      return
    }

    await updateDate(timelineItems, 'start')
    await updateDate(timelineItems, 'end')
    client.close()
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
