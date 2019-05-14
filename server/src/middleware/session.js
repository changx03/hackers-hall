import connectMongo from 'connect-mongo'
import session from 'express-session'
import config from '../../config/config'

export default function sessionConfig(app) {
  // extending session prototype
  // Returns the same session - this will open a Session Fixation Attack
  // session.Session.prototype.login = function(user) {
  //   this.userInfo = user
  // }

  session.Session.prototype.login = function(user, callback) {
    const req = this.req
    req.session.regenerate(err => {
      if (err) {
        callback(err)
      }
      req.session.userInfo = user
      callback()
    })
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
      maxAge: 3600 * 1000 /** 1 hour in millisecond */
    },
    // Creating TTL (time-to-live) index requires admin right. This helps
    // remove expired sessions
    store: new MongoStore({
      url: config.dbUriAdmin,
      // collection: 'sessions', /** default */
      // autoRemove: 'native', /** default */
      ttl: 3600 /** 1 hour in second */
    }),
    name: 'sid' // By default `express-session` uses name 'connect.sid'. We can make it less obvious what package we are using.
  }

  if (config.mode === 'production') {
    app.set('trust proxy', 1)
    options.cookie.secure = true // serve secure cookies
  }

  app.use(session(options))
}
