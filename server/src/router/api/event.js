import { Router } from 'express'
import EventVotesDAO from '../../db/EventVotesDAO'
import Auth from '../../middleware/auth'

const eventVoteRouter = Router()

eventVoteRouter
  .route('/')
  .get(async (_req, res, next) => {
    try {
      const dataRes = await EventVotesDAO.getPopularVotes()
      res.json(dataRes)
    } catch (e) {
      next(e)
    }
  })
  // this is a protected route
  .post(Auth.checkUser(), async (req, res, next) => {
    if (!req.user) {
      res.status(401).send('Please log in')
      return
    }
    const { _id: userId } = req.user
    const { eventId } = req.body
    try {
      const dataRes = await EventVotesDAO.vote(eventId, userId)
      res.json(dataRes)
    } catch (e) {
      next(e)
    }
  })

export default eventVoteRouter
