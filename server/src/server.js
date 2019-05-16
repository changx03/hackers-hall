import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { mw } from 'request-ip'
import { errorHandler } from './middleware/errorHandler'
import sessionConfig from './middleware/session'
import router from './router'
import reportViolation from './middleware/reportViolation'

const app = express()
export const insecureApp = express()

// setup a redirect from http to https
insecureApp.all('*', (req, res, next) => {
  res.redirect(307, `https://localhost/${req.url}`)
  next()
})

process.env.NODE_ENV !== 'production' && app.use(morgan('dev'))
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js", 'https://fonts.googleapis.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://use.fontawesome.com', 'https://fonts.googleapis.com'],
    imgSrc: ["'self'"],
    fontSrc: ["'self'", 'https://use.fontawesome.com', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
    connectSrc: ["'self'"], // web socket
    reportUri: "/report-violation"
  }
}))
app.use(
  cors({
    origin: 'http://localhost:3030',
    optionsSuccessStatus: 200
  })
)
app.use(bodyParser.json({
  type: ['json', 'application/csp-report']
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(mw()) // middleware for get client IP from `req.clientIp`

// static folder
app.use(express.static(path.resolve(__dirname, '../../dist')))

// session uses different client due to it requires db admin user role
sessionConfig(app)

// routes
app.use(reportViolation)
app.use(router)

app.use(errorHandler())

export default app
