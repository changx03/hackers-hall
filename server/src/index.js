import chalk from 'chalk'
import { MongoClient } from 'mongodb'
import config from '../config/config'
import EventVotesDAO from './db/EventVotesDAO'
import LoginAttemptsDAO from './db/LoginAttemptsDAO'
import TimelineItemsDAO from './db/TimelineItemsDAO'
import UsersDAO from './db/UsersDAO'
import app, { insecureApp } from './server'
import fs from 'fs'
import https from 'https'
import path from 'path'

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../../data/hackershall.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../data/hackershall.crt'))
}

console.log('MODE: ' + chalk.yellow(config.mode))
!config.isProd && console.log('DB_URI: ' + chalk.blue(config.dbUri))

MongoClient.connect(config.dbUri, {
  useNewUrlParser: true,
  poolSize: config.isProd ? 50 : 10,
  wtimeout: 5000 // 5 seconds
})
  .then(async client => {
    // connection db here
    await TimelineItemsDAO.injectDB(client)
    await EventVotesDAO.injectDB(client)
    await UsersDAO.injectDB(client)
    await LoginAttemptsDAO.injectDB(client)

    // app.listen(config.port, () => {
    //   console.log('listening on ' + chalk.green(`http://localhost:${config.port}`))
    // })
    insecureApp.listen(config.port, config.hostName, () => {
        console.log('listening on ' + chalk.green(`http://${config.hostName}`))
        console.log('listening on ' + chalk.green(`https://${config.hostName}`))
      })
    https.createServer(options, app).listen(443)
  })
  .catch(err => {
    console.error(chalk.red(err.stack))
    process.exit(1)
  })
