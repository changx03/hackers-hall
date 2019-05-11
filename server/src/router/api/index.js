import { Router } from 'express'
import userRouter from './user';
import eventVoteRouter from './event';
import timelineRouter from './timeline';

const router = new Router()

router.use('/user', userRouter)
router.use('/event/vote', eventVoteRouter)
router.use('/timeline', timelineRouter)

export default router
