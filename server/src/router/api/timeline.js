import { Router } from 'express'
import TimelineItemsDAO from '../../db/TimelineItemsDAO'

const timelineRouter = Router()

timelineRouter.route('*').get(async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query
    let results
    results = await TimelineItemsDAO.getTimelineItemsByRange(startDate, endDate)
    res.json({ timelineItems: results.timelineItems })
  } catch (err) {
    next(err)
  }
})

export default timelineRouter
