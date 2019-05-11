import { Router } from 'express'
import Auth from '../middleware/auth'
import apiRouter from './api'
import { reactRender } from './reactRender'

const router = new Router()

router.use('/api', apiRouter)
router.use('*', Auth.checkUser(), reactRender)

export default router
