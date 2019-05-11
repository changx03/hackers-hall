import connectMongo from 'connect-mongo'
import session from 'express-session'
import config from '../../config/config'

export default function sessionConfig(app) {
  // extending session prototype
  session.Session.prototype.login = function(user) {
    this.userInfo = user
  }

  // session
  const MongoStore = connectMongo(session)

  const options = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: false,
      secure: false,
      maxAge: 7 * 24 * 3600 * 1000 /** 7days in millisecond */
    },
    // Creating TTL (time-to-live) index requires admin right. This helps
    // remove expired sessions
    store: new MongoStore({
      url: config.dbUriAdmin,
      // collection: 'sessions', /** default */
      // autoRemove: 'native', /** default */
      ttl: 7 * 24 * 3600 /** 7 day in second */
    })
  }

  if (config.mode === 'production') {
    app.set('trust proxy', 1)
    options.cookie.secure = true // serve secure cookies
  }

  app.use(session(options))
}
