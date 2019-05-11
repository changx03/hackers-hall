import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { errorHandler } from './middleware/errorHandler'
import sessionConfig from './middleware/session'
import router from './router'

const app = express()

process.env.NODE_ENV !== 'production' && app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// static folder
app.use(express.static(path.resolve(__dirname, '../dist')))

// session uses different client due to it requires db admin user role
sessionConfig(app)

// routes
app.use(router)

app.use(errorHandler())

export default app
