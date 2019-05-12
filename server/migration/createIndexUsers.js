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

console.log(`Connecting to ${config.dbUriAdmin}`)

MongoClient.connect(config.dbUriAdmin, {
  useNewUrlParser: true
})
  .then(async client => {
    const db = client.db(config.database)
    const users = await db.collection(collections.Users)

    // Client can only use email for login
    let res
    // res = await users.dropIndex('username_1');
    // console.log(chalk.green(res))
    // res = await users.createIndex({ username: 1 }, { unique: true })
    // console.log(chalk.green(res))

    const emailIndex = 'email_1'
    res = await users.indexExists(emailIndex)
    if (res) {
      console.log(chalk.yellow(`Found index: ${emailIndex}`))
      res = await users.dropIndex('email_1')
      console.log(res)
    }
    console.log(chalk.green(`Creating index "${emailIndex}"...`))
    res = await users.createIndex({ email: 1 }, { unique: true })
    console.log(chalk.green(res))

    client.close()
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
